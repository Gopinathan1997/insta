import React from 'react'

const SearchContext = React.createContext({
  searchList: [],
  searchResult: 'INITIAL',
  getSearchData: () => {},
  initiateSearchPostLikeApi: () => {},
  retrySearch: () => {},
})

export default SearchContext
