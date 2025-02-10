import React from 'react'
import "../styles/Categories.scss"
import { List } from "../categories.json"

const Categories = () => {
    return (
        <div className='Categories'>
            <h4>Order our best food options</h4>
            <div className="items">
                {List.map((item, index) => (
                    <div className='item' key={index}>
                        <img src={item.image} alt={item.name} />
                        <p>{item.name}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Categories