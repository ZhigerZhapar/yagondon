// components/hooks/usePostsFetch.js
import { useEffect, useState } from 'react';
import axios from 'axios';

const usePostsFetch = (categoryId) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(
                    `https://places-test-api.danya.tech/api/categories/${categoryId}?populate=posts,posts.images,posts.category,posts.subcategory,posts.subsubcategory`
                );
                setPosts(response.data.attributes.posts.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();

    }, [categoryId]);

    return { loading, error, posts };
};

export default usePostsFetch;
