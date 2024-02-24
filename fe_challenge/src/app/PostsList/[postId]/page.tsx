'use client'
import React from 'react';
import axios from 'axios';
import { Box,Grid, GridItem, Text, Link, Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

interface Comment{
    id:number,
    post_id:number,
    name:string,
    email:string,
    body:string,
}
export default function PostDetails({
        params,
    }:{
        params:{postId:string};
    }){
        const router = useRouter()
        const postId = params.postId;
        const [post, setPost] = React.useState(null);
        const [comments, setComments] = React.useState<Comment[]>([])
        React.useEffect(()=>{
            const fetchPostData = async () => {
                try {
                  const response1 = await axios.get(`https://gorest.co.in/public/v2/posts/${postId}`);
                  setPost(response1.data);
                } catch (error) {
                  console.error('Error fetching post details:', error);
                }
              };
            const fetchPostComments = async () => {
                try {
                  const response2 = await axios.get(`https://gorest.co.in/public/v2/posts/${postId}/comments`);
                  setComments(response2.data);
                } catch (error) {
                  console.error('Error fetching post details:', error);
                }
              };
          
              if (postId) {
                fetchPostData();
                fetchPostComments()
              }
        },[postId])
        console.log("post",post, comments)
        if (post === null) {
            return (
                <Box>
                    <Text>Loading...</Text>
                </Box>
            );
        }
        return(
            <Box w="100%" h="full" bgColor="green" paddingTop={2} display="flex" flexDirection="column">
                <Grid templateColumns="repeat(3,1fr)" h="8vh" w="90%" mx="auto">
                    <GridItem w="100%">
                        <Box display="flex" justifyContent="center" alignItems="center" h="100%">
                            <Link as={Button} onClick={()=>router.back()}>
                                <Text>Back</Text>
                            </Link>
                        </Box> 
                    </GridItem>
                    <GridItem>
                        <Box display="flex" justifyContent="center" alignItems="center" h="100%">
                            <Text fontSize={40} fontWeight="bold" textAlign="center" my="auto">Post Details</Text>
                        </Box>
                    </GridItem>
                    <GridItem w="100%">
                        <Box display="flex" justifyContent="center" alignItems="center" h="100%">
                            <Link href="/">
                                <Text>Home</Text>
                            </Link>
                        </Box> 
                    </GridItem>
                </Grid>
            </Box>
        )
}
