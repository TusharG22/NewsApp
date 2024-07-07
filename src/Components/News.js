import React, { Component } from 'react';
import NewsItems from './Newsitems';
import Loading from './Loading';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

export class News extends Component {
  static defaultProps = {
    country: 'in',
    pageSize: 12,
    category: 'general',
  };

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      page: 1,
      totalResults: 0,
      loading: true, // Initialize loading state
      error: null, // Initialize error state
    };
  }

  async updateNews() {
    this.props.setProgress(10);
    
    try {
      const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=5ded1ff17ad2432081f746a779c87404&page=${this.state.page}&pageSize=${this.props.pageSize}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const parsedData = await response.json();
      this.props.setProgress(70);
      console.log('Fetched data:', parsedData);
      if (parsedData.articles && parsedData.articles.length > 0) {
        this.setState({
          articles: parsedData.articles,
          totalResults: parsedData.totalResults,
          loading: false,
          error: null, // Clear any previous errors
        })
        this.props.setProgress(100);
      } else {
        this.setState({ loading: false, error: 'No articles found' });
      }
    } 
    catch (error) {
      console.error('Error fetching data:', error);
      this.setState({ loading: false, error: 'Failed to fetch data' });
    }
  }

  async componentDidMount() {
    this.updateNews();
  }

  fetchMoreData = async () => {
    this.setState({ page: this.state.page + 1, loading: true, error: null });
    try {
      const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=5ded1ff17ad2432081f746a779c87404&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const parsedData = await response.json();
      console.log('Fetched more data:', parsedData);
      if (parsedData.articles && parsedData.articles.length > 0) {
        this.setState((prevState) => ({
          articles: [...prevState.articles, ...parsedData.articles],
          totalResults: parsedData.totalResults,
          loading: false,
          error: null, // Clear any previous errors
        }));
      } else {
        this.setState({ loading: false, error: 'No more articles found' });
      }
    } catch (error) {
      console.error('Error fetching more data:', error);
      this.setState({ loading: false, error: 'Failed to fetch more data' });
    }
  };

  render() {
    const { articles, loading, totalResults, error } = this.state;

    return (
      <>
        <div className='container my-3'>
          <h2>Headlines</h2>
          {loading && <Loading />}
          {error && <p className='text-danger'>{error}</p>}
          <InfiniteScroll
            dataLength={articles.length}
            next={this.fetchMoreData}
            hasMore={articles.length < totalResults}
            loader={<Loading />}
          >
            <div className='container'>
              <div className='row'>
                {articles.map((element) => (
                  <div className='col-md-4' key={element.url}>
                    <NewsItems
                      title={element.title ? element.title : ''}
                      description={
                        element.description
                          ? element.description.slice(0,90)
                          : element.title
                      }
                      imgUrl={element.urlToImage}
                      newsUrl={element.url}
                    />
                  </div>
                ))}
              </div>
            </div>
          </InfiniteScroll>
        </div>
      </>
    );
  }
}

export default News;
