import React, { useState, useEffect, useRef } from 'react';
import '../styles/UserMenu.scss';
import { BASE_URL } from '../../config';
import axios from 'axios';
import { List } from "../categories.json"
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AOS from 'aos';
import 'aos/dist/aos.css';

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const UserMenu = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [location, setLocation] = useState("your area");
  const [quantities, setQuantities] = useState({});

  const debouncedUpdateCart = useRef(
    debounce(async (itemId, quantity) => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No token found");
        return;
      }
      try {
        await axios.patch(
          `${BASE_URL}/api/menu/cart`,
          { menuItem: itemId, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(`Cart updated for item ${itemId}: quantity ${quantity}`);
      } catch (error) {
        console.error("Error updating cart:", error.response?.data || error.message);
      }
    }, 100)
  );

  useEffect(() => {
    AOS.init();
  }, [])

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("No token found");
          return;
        }
        const response = await axios.get(`${BASE_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const getMenus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("No token found");
          return;
        }
        const response = await axios.get(`${BASE_URL}/api/menu`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching menus:", error);
      }
    };

    const getCart = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("No token found");
          return;
        }
        const response = await axios.get(`${BASE_URL}/api/menu/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.items && response.data.items.length > 0) {
          const cartQuantities = {};
          response.data.items.forEach(cartItem => {
            const menuId = cartItem.menuItem._id || cartItem.menuItem;
            cartQuantities[menuId] = cartItem.quantity;
          });
          setQuantities(cartQuantities);
        }
      } catch (error) {
        console.error("Error fetching cart:", error.response?.data || error.message);
      }
    };

    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`)
              .then(response => response.json())
              .then(data => {
                const { suburb, city, town, village, district, country } = data.address;
                const locationName = suburb || city || town || village || district || country || "your area";
                setLocation(locationName);
              })
              .catch(error => {
                console.error("Error fetching location:", error);
              });
          },
          (error) => {
            console.error("Geolocation error:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    getUserLocation();
    getMenus();
    getUserProfile();
    getCart();
    setLoading(false);
  }, []);

  const handleAdd = (itemId) => {
    setQuantities(prev => {
      const newQty = 1;
      debouncedUpdateCart.current(itemId, newQty);
      return { ...prev, [itemId]: newQty };
    });
  };

  const handleIncrement = (itemId) => {
    setQuantities(prev => {
      const newQty = (prev[itemId] || 0) + 1;
      debouncedUpdateCart.current(itemId, newQty);
      return { ...prev, [itemId]: newQty };
    });
  };

  const handleDecrement = (itemId) => {
    setQuantities(prev => {
      const currentQty = prev[itemId] || 0;
      let newQty = currentQty;
      if (currentQty === 1) {
        newQty = 0;
      } else if (currentQty > 1) {
        newQty = currentQty - 1;
      }
      debouncedUpdateCart.current(itemId, newQty);
      return { ...prev, [itemId]: newQty };
    });
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 2000,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
          autoplay: true,
          autoplaySpeed: 2500,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          autoplay: true,
          autoplaySpeed: 3000,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 3500,
        }
      }
    ]
  };

  const SampleNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "gray" }}
        onClick={onClick}
      />
    );
  };

  const SamplePrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "gray" }}
        onClick={onClick}
      />
    );
  };

  sliderSettings.nextArrow = <SampleNextArrow />;
  sliderSettings.prevArrow = <SamplePrevArrow />;

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="UserMenu">
      <div className="categories">
        <h3>
          {user?.username ? (
            <>
              <span className="username">{user.username}</span>, what's on your mind?
            </>
          ) : (
            "Welcome! What's on your mind?"
          )}
        </h3>
        <div className="category-slider">
          <Slider {...sliderSettings}>
            {List.map((category, index) => (
              <div key={index} className="category-item">
                <div className="category-image-container">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="category-image"
                  />
                </div>
                <h4 className="category-name">{category.name}</h4>
              </div>
            ))}
          </Slider>
        </div>

        <div className="menu-items">
          <h2>
            Best dishes near <span className="location">{location}</span>
          </h2>
          <div className="items">
            {items.map(item => {
              const itemQuantity = quantities[item._id] || 0;
              return (
                <div className="item"
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  data-aos-delay="500"
                  data-aos-easing="ease-in"
                  key={item._id}>
                  <img src={item.imageUrl} alt={item.name} />
                  <div className="info">
                    <h3>{item.name}</h3>
                    <p>{item.category}</p>
                    <p>${item.price.toFixed(2)}</p>
                  </div>
                  <div className="quantity-control">
                    {itemQuantity === 0 ? (
                      <button className="add-btn" onClick={() => handleAdd(item._id)}>
                        Add
                      </button>
                    ) : (
                      <div className="quantity-buttons">
                        <button className="decrement-btn" onClick={() => handleDecrement(item._id)}>
                          -
                        </button>
                        <span className="quantity">{itemQuantity}</span>
                        <button className="increment-btn" onClick={() => handleIncrement(item._id)}>
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
