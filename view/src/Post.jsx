import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [msg, setMsg] = useState(null);
  let navigate = useNavigate();

  // Validate the user's token
  const validate = async () => {
    let token = localStorage.getItem('token');
    if (!token) {
      navigate('/signup');
    }

    const res = await axios.get('http://localhost:5000/api/auth/protected', {
      headers: {
        'access-token': token,
      },
    });

    setMsg(res.data.message);
    setTimeout(() => {
      setMsg(null);
    }, 3000);

    if (!res) {
      navigate('/signup');
    }
  };

  // Fetch posts from the server
  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/posts');
      setPosts(prevPosts => [...prevPosts, ...res.data]);
      if (res.data.length === 0) {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle scroll for infinite loading
  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const scrollFraction = scrollTop / (scrollHeight - clientHeight);
    if (scrollFraction > 2 / 3) {
      fetchPosts();
    }
  };

  // Use effects
  useEffect(() => {
    validate();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Render the component
  return (
    <>
      <NavBar />
      <div className="container">
        {msg && (
          <div style={{ margin: "20px", backgroundColor: "white", color: "green", padding: "10px", borderRadius: '10px 10px 10px 10px' }}>
            <h2>{msg}</h2>
          </div>
        )}
        <div className="row">
          {posts.map(post => (
            <div key={post.id} className="col-12 col-md-6 col-lg-4 mb-4">
              <div className="card">
                <img src={"/src/" + post.image} className="card-img-top" alt="Post" />
                <div className="card-body">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">{post.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {hasMore && (
          <div className="row">
            <div className="col text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Post;
