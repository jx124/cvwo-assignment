import React, { useCallback, useEffect } from 'react'
import { useAppSelector } from '../../app/hooks';
import { PostState, selectPosts, setRankedPosts } from '../posts/postSlice';
import { debounce } from 'lodash';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../app/store';
import { getSearchResults } from './search';

/** Search bar component. Checks search field and searches through posts state, then
 *  updates results to rankedPosts state.
 */
function SearchBar() {
    const posts = useAppSelector(selectPosts);
    const dispatch = useDispatch<AppDispatch>();

    function updateSearchResults(posts: PostState[], tokens: string[]) {
        const results = getSearchResults(posts, tokens);
        dispatch(setRankedPosts(results));
    }

    useEffect(() => {
        updateSearchResults(posts, [""]);
    }, [posts])

    // debounce search to only update results every 200ms on search change
    const searchHandler = useCallback(debounce(updateSearchResults, 200), []);

    const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const tokens = event.target.value.trim().toLowerCase().split(" ");
        searchHandler(posts, tokens);
    }

    return (
        <div className='card mb-3' style={{ margin: "5em" }}>
            <div className='card-body m-0 px-3 py-2'>
                <div className='row'>
                    <div className='col-auto'>
                        <label htmlFor='searchInput'
                            className='form-label mt-2'>Search: </label>
                    </div>
                    <div className='col'>
                        <input type="text"
                            className='form-control'
                            onChange={onSearchChange} />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default SearchBar