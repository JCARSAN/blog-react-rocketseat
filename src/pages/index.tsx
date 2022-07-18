import { GetStaticProps } from 'next';
import Header from '../components/Header';
import { getPrismicClient } from '../services/prismic';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { AiOutlineCalendar } from 'react-icons/ai';
import { FiUser } from 'react-icons/fi';
import  Link  from 'next/link';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostHome {
    posts: Post[];
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home( props: HomeProps) {
   // TODO
   const [posts,setPosts] = useState<Post[]>(props.postsPagination.results);
   const [nextPage,setNextPage] = useState(props.postsPagination.next_page);
   
   function handlePagination(){
      fetch(nextPage)
        .then(response => response.json())
        .then(data => { 
          setPosts([...posts,...data.results]); 
          setNextPage(data.next_page);
        });
   }

   return(
    <>
      <Header />
      <div className={styles.homeContent}>
      { 
         
        posts.map((post) => {
          return(
            <div key={post.uid} className={styles.homeContentPost}>
                    <Link href={`/post/${post.uid}`}>
                      <a>
                        <h2>{post.data.title}</h2>
                      </a>
                    </Link>   
                    <h3>{post.data.subtitle}</h3>
                    <div className={styles.homeContentPostInfo}>
                      <div>
                        <AiOutlineCalendar />
                        <span>{ format(new Date(post.first_publication_date),"dd MMM yyyy",{locale:ptBR})  }</span>
                      </div>
                      <div>
                        <FiUser />
                        <span>{post.data.author}</span>
                      </div>
                    </div>
            </div>
          )
        })
      
      } 
      {           
        nextPage &&
        (
          <button className={styles.mostPostsLink} onClick={handlePagination}>Carregar mais posts</button>
        )  
      }
        
      </div>
    </>
   );
 }

export const getStaticProps : GetStaticProps = async () => {
   const prismic = getPrismicClient({});
   const postsResponse = await prismic.getByType('posts',{page:1,pageSize:1});
   
   return{
      props:{
        postsPagination:{
          next_page:postsResponse.next_page,
          results: postsResponse.results
        }
      }
   }
   
};

