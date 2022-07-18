import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import Header from '../../components/Header';
import { getPrismicClient } from '../../services/prismic';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import Image from 'next/image';
import { AiFillClockCircle, AiOutlineCalendar } from 'react-icons/ai';
import { FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useRouter } from 'next/router';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post(props : PostProps) {
   // TODO
   const route = useRouter();
   
   const postContent = props.post.data.content;
   
   return(
    <>
      <Header />
      {route.isFallback && <div>Carregando...</div>}
      <main className={styles.postContainer}>
        <img src={props.post.data.banner.url} alt="Banner do post" />
        <article className={styles.postContent}>
          <h2>{props.post.data.title}</h2>
          <div className={styles.postContentInfo}>
            <div>
              <AiOutlineCalendar />
              <span>{format(new Date(props.post.first_publication_date),"dd MMM yyyy",{locale:ptBR})}</span>
            </div>
            <div>
              <FiUser />
              <span>{props.post.data.author}</span>
            </div>
            <div>
              <AiFillClockCircle />
              <span>4 min</span>
            </div>
          </div>
          {

            postContent.map((content,index) => {
              return(
                <div key={index} className={styles.postContentText}>
                  <h3>{content.heading}</h3>
                  <div className={styles.postText} dangerouslySetInnerHTML={{ __html: RichText.asHtml(content.body)}} />
                </div>
                )  
            })
            
          }
        </article>
      </main>
    </>
   )
}

export const getStaticPaths = async () => {
   const prismic = getPrismicClient({});
   const posts = await prismic.getByType('posts');
   // TODO

   return {
      paths: [
        {params: {slug: 'como-utilizar-hooks'}},
        {params: {slug: 'criando-um-app-cra-do-zero'}},
      ],
      fallback: true
   }
};

export const getStaticProps = async ({ params }) => {
   const prismic = getPrismicClient({});
   const slug = params.slug;
   const response = await prismic.getByUID('posts',String(slug),{});
   // TODO
   const post = {
      data: {
        title: response.data.title,
        subtitle: response.data.subtitle,
        banner: {
          url: response.data.banner.url
        },
        author: response.data.author,
        content: response.data.content,
      },
      first_publication_date: response.first_publication_date,
      uid: response.uid,
   }
   //console.log("getStaticProps Post response: ",JSON.stringify(response,null,2));
   return {
      props: { post, }
   }
};
