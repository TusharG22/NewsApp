import React, { Component } from 'react'

export class Newsitems extends Component {
    
  render() {
    let{title, description, imgUrl ,newsUrl} = this.props;
    return (
      <div>
        
        <div className="card" >
  <img src={!imgUrl?"https://akm-img-a-in.tosshub.com/indiatoday/images/story/202406/iphone-15-pro-max-291834181-16x9_3.png?VersionId=HBPbOChX5mVluIFv9VNhe6IRw9wd3OMy": imgUrl} className="card-img-top" alt="..."/>
  <div className="card-body">
    <h5 className="card-title">{title}</h5>
    <p className="card-text">{description}</p>
    <a href={newsUrl}  target ="_blank" className="btn btn-primary">Read More</a>
  </div>
</div>
      </div>
    )
  }
}

export default Newsitems
