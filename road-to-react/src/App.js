import React from 'react';
import axios from 'axios';
import {sortBy} from 'lodash';


const API_BASE = 'https://hn.algolia.com/api/v1';
const API_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const getUrl = (searchTerm, page) => `${API_BASE}${API_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`;

const SORTS = {
    NONE: list => list,
    TITLE: list => sortBy(list, 'title'),
    AUTHOR: list => sortBy(list, 'author'),
    COMMENT: list => sortBy(list, 'num_comments').reverse(),
    POINT: list => sortBy(list, 'points').reverse(),
};


const useSemiPersistentState = (key, initialState) => {
    const [value, setValue] = React.useState(
        localStorage.getItem(key) || initialState
    );

    React.useEffect(() => {
        localStorage.setItem(key, value);
    }, [value, key]);

    return [value, setValue];
};

const storiesReducer = (state, action) => {
    switch (action.type) {
        case 'STORIES_FETCH_INIT':
            return {
                ...state,
                isLoading: true,
                isError: false,
            };
        case 'STORIES_FETCH_SUCCESS':
            return {
                ...state,
                isLoading: false,
                isError: false,
                data: action.payload.page === 0 ? action.payload.list : state.data.concat(action.payload.list),
                page: action.payload.page,
            };
        case 'STORIES_FETCH_FAILURE':
            return {
                ...state,
                isLoading: false,
                isError: true,
            };
        case 'REMOVE_STORY':
            return {
                ...state,
                data: state.data.filter(
                    story => action.payload.objectID !== story.objectID
                ),
            };
        default:
            throw new Error();
    }
};

const App = () => {

    const [searchTerm, setSearchTerm] = useSemiPersistentState(
        'search',
        'React'
    );

    const [urls, setUrls] = React.useState(
        [getUrl(searchTerm, 0)]
    );

    const [stories, dispatchStories] = React.useReducer(
        storiesReducer,
        {data: [], page: 0, isLoading: false, isError: false}
    );

    const handleMore = () => {
        const lastUrl = urls[urls.length - 1];
        const searchTerm = extractSearchTerm(lastUrl);
        handleSearch(searchTerm, stories.page + 1);
    };

    const handleFetchStories = React.useCallback(async () => {
        dispatchStories({type: 'STORIES_FETCH_INIT'});

        try {
            const lastUrl = urls[urls.length - 1];
            const result = await axios.get(lastUrl);

            dispatchStories({
                type: 'STORIES_FETCH_SUCCESS',
                payload: {
                    list: result.data.hits,
                    page: result.data.page,
                },
            });
        } catch {
            dispatchStories({type: 'STORIES_FETCH_FAILURE'});
        }
    }, [urls]);

    React.useEffect(() => {
        handleFetchStories();
    }, [handleFetchStories]);

    const handleRemoveStory = item => {
        dispatchStories({
            type: 'REMOVE_STORY',
            payload: item,
        });
    };

    const handleSearch = (searchTerm, page) => {
        const url = getUrl(searchTerm, page);
        setUrls(urls.concat(url));
    };

    const handleSearchInput = event => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = event => {
        handleSearch(searchTerm, 0);

        event.preventDefault();
    };

    const handleLastSearch = searchTerm => {
        setSearchTerm(searchTerm);
        handleSearch(searchTerm, 0);
    };

    const extractSearchTerm = url =>
        url.substring(url.lastIndexOf('?') + 1, url.lastIndexOf('&')).replace(PARAM_SEARCH, '');
    const getLastSearches = urls => [...new Set(urls)].slice(-6, -1).map(url => extractSearchTerm(url));

    const lastSearches = getLastSearches(urls);

    return (
        <div>
            <h1>My Hacker Stories</h1>

            <SearchForm
                searchTerm={searchTerm}
                onSearchInput={handleSearchInput}
                onSearchSubmit={handleSearchSubmit}
            />

            {lastSearches.map((searchTerm, index) =>
                <button type="button" key={searchTerm + index} onClick={() => handleLastSearch(searchTerm)}
                >{searchTerm}</button>
            )}

            <hr/>

            {stories.isError && <p>Something went wrong ...</p>}


            <List list={stories.data} onRemoveItem={handleRemoveStory}/>
            {stories.isLoading ? (
                <p>Loading ...</p>
            ) : (
                <button type="button" onClick={handleMore}>More</button>
            )}

        </div>
    );
};

const SearchForm = ({
                        searchTerm,
                        onSearchInput,
                        onSearchSubmit,
                    }) => (
    <form onSubmit={onSearchSubmit}>
        <InputWithLabel
            id="search"
            value={searchTerm}
            isFocused
            onInputChange={onSearchInput}
        >
            <strong>Search:</strong>
        </InputWithLabel>

        <button type="submit" disabled={!searchTerm}>
            Submit
        </button>
    </form>
);

const InputWithLabel = ({
                            id,
                            value,
                            type = 'text',
                            onInputChange,
                            isFocused,
                            children,
                        }) => {
    const inputRef = React.useRef();

    React.useEffect(() => {
        if (isFocused) {
            inputRef.current.focus();
        }
    }, [isFocused]);

    return (
        <>
            <label htmlFor={id}>{children}</label>
            &nbsp;
            <input
                ref={inputRef}
                id={id}
                type={type}
                value={value}
                onChange={onInputChange}
            />
        </>
    );
};

const List = ({list, onRemoveItem}) => {
    const [sort, setSort] = React.useState({sortKey: 'NONE', isReverse: false});

    const handleSort = sortKey => {
        const isReverse = sort.sortKey === sortKey && !sort.isReverse;
        setSort({sortKey, isReverse})
    };

    const sortFunction = SORTS[sort.sortKey];
    const sortedList = sort.isReverse ? sortFunction(list).reverse() : sortFunction(list);

    return (
        <div>
            <div style={{display: 'flex'}}>
                <span style={{width: '40%'}} onClick={() => handleSort('TITLE')}>Title</span>
                <span style={{width: '30%'}} onClick={() => handleSort('AUTHOR')}>Author</span>
                <span style={{width: '10%'}} onClick={() => handleSort('COMMENT')}>Comments</span>
                <span style={{width: '10%'}} onClick={() => handleSort('POINT')}>Points</span>
                <span style={{width: '10%'}}>Actions</span>
            </div>
            {sortedList.map(item => (
                <Item
                    key={item.objectID}
                    item={item}
                    onRemoveItem={onRemoveItem}
                />
            ))}
        </div>
    )
};

const Item = ({item, onRemoveItem}) => (
    <div style={{display: 'flex'}}>
        <span style={{width: '40%'}}><a href={item.url}>{item.title}</a></span>
        <span style={{width: '30%'}}>{item.author}</span>
        <span style={{width: '10%'}}>{item.num_comments}</span>
        <span style={{width: '10%'}}>{item.points}</span>
        <span style={{width: '10%'}}><button type="button" onClick={() => onRemoveItem(item)}>
        Dismiss
      </button></span>
    </div>
);

export default App;

export {storiesReducer, SearchForm, InputWithLabel, List, Item};
