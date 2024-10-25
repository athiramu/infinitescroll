import React, { useRef, useEffect } from 'react';
import { useInfiniteQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import 'bootstrap/dist/css/bootstrap.min.css';

const queryClient = new QueryClient();

function InfiniteData() {
  const loadMoreRef = useRef(null);

  const fetchData = async ({ pageParam = 1 }) => {
    const { data } = await axios.get(`https://api.javascripttutorial.net/v1/quotes/?page=${pageParam}&limit=5`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return data;
  };

  const {
    data,
    status,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['quote'],
    queryFn: fetchData,
    getNextPageParam: (_lastPage, pages) => {
      return pages.length < 3 ? pages.length + 1 : undefined;
    },
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Inspirational Quotes</h2>

      {status === 'loading' && (
        <div className="d-flex justify-content-center">
          <AiOutlineLoading3Quarters className="spinner-border" />
          <p className="ms-2">Loading...</p>
        </div>
      )}
      {status === 'error' && (
        <div className="alert alert-danger text-center">Error loading data</div>
      )}

      {status === 'success' && (
        <ul className="list-unstyled">
          {data.pages.map((page) =>
            page.data.map((quote) => (
              <li key={quote.id} className="mb-3">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <p className="card-text">&ldquo;{quote.quote}&rdquo;</p>
                    <footer className="blockquote-footer text-muted">- {quote.author}</footer>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      )}

      <div ref={loadMoreRef} className="text-center my-4">
        {isFetchingNextPage ? (
          <AiOutlineLoading3Quarters className="spinner-border text-primary" />
        ) : (
          !hasNextPage && <p className="text-muted"></p>
        )}
        
      </div>
      {isFetching && !isFetchingNextPage && (
        <div className="d-flex justify-content-center text-primary">
          <AiOutlineLoading3Quarters className="spinner-border" />
          <p className="ms-2">Background Updating...</p>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <InfiniteData />
    </QueryClientProvider>
  );
}
