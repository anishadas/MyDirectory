import React, { useEffect, useRef, useState } from 'react'
import styles from './styles.module.css'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import open from '../../assets/open.png'
import Clock from '../Clock/Clock';
import Loading from '../Loader/Loading';
const Profile = () => {
  const [user, setUser] = useState({ name: "", username: "", email: "", phone: "", address: "", phrase: "", posts: 0 });
  const [posts, setPosts] = useState([]);
  const [popup, setPopup] = useState(false);
  const [popupPost, setPopupPost] = useState({});
  const [isLoading,setIsLoading]=useState(false)

  //get id and post count from route
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const postsCount = queryParams.get('posts');

  const mainRef = useRef();

  // get the selected user
  useEffect(() => {
    const getUser = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
        const data = await res.json();
        const { name, username, email, phone, company, address } = data;
        let completeAddress = `${address.suite}, ${address.street}, ${address.city},${address.zipcode}`;
        setUser({
          name, username, email, phone, phrase: company.catchPhrase, address: completeAddress, posts: postsCount
        });
        setIsLoading(false)
      } catch (err) {
        console.log(err)
      }

    }
    getUser();
  }, [])

  // fetch the posts of a user
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${postsCount}`)
        const data = await res.json()
        setPosts(data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchPosts()
  }, [])

  // post popup
  const handleShowPopup = async (id) => {
    console.log("reached")
    try {
      setIsLoading(true)
      const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
      const data = await res.json()
      setPopupPost(data)
      setPopup(true);
      setIsLoading(false)
      mainRef.current.style.opacity = 0.3
    } catch (err) {
      console.log(err)
    }
  }

  //close popup with click in background
  const handleClosePopup = () => {
    mainRef.current.style.opacity = 1;
    setPopup(false);
    setPopupPost({})
  }

  //back button
  const handleBack = () => {
    navigate('/')
  }

  return (
    <>
      {popup &&
        <div className={styles.popup}>
          <div className={styles.post}>
            <div className={styles.overlay}></div>
            <p className={styles.postTitle}>{popupPost.title}</p>
            <p className={styles.body}>{popupPost.body}</p>
          </div>
        </div>
      }
      {
        isLoading && <Loading/>
      }
      <div className={styles.profile} ref={mainRef} onClick={handleClosePopup}>
        <div className={styles.header}>
          <button onClick={handleBack}>back</button>
          <div className={styles.navs}>
            <Clock/>
          </div>
        </div>
        <div className={styles.user}>
          <p className={styles.title}>Profile Page</p>
          <div className={styles.userDetails}>
            <div className={styles.userInfo}>
              <p>{user.name}</p>
              <p>{user.username} | {user.phrase}</p>
            </div>
            <div className={styles.userInfo}>
              <p>{user.address}</p>
              <p>{user.email} | {user.phone}</p>
            </div>
          </div>
        </div>
        <div className={styles.posts}>
          {
            posts && posts.map((post, index) => (
              <div className={styles.container} key={index} >
                <div className={styles.overlay}>
                  <p className={styles.overlayText} onClick={() => handleShowPopup(post.id)}>
                    <span>view full post</span>
                    <img src={open} alt='open' />
                  </p>
                </div>
                <div className={styles.post} key={index}>
                  <div className={styles.overlay}></div>
                  <p className={styles.postTitle}>{post.title}</p>
                  <p className={styles.body}>{post.body}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </>
  )
}

export default Profile
