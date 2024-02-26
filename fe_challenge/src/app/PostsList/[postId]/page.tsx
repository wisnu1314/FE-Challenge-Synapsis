'use client'
import React from 'react';
import axios from 'axios';
import { Box,Grid, GridItem, Text, Link, Button, Card, CardHeader, CardBody } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

// export class Comment{
//     id:number = 0;
//     post_id:number =0;
//     name:string = '';
//     email:string = '';
//     body:string= '';
// }
interface Comment {
    id:number,
    post_id:number,
    name:string,
    email:string,
    body:string,
  }
interface Post {
    id: number,
    user_id: number,
    title: string,
    body: string,
  }
export default function PostDetails({
        params,
    }:{
        params:{postId:string};
    }){
        const router = useRouter()
        const postId = params.postId;
        const [post, setPost] = React.useState<Post>();
        const [comments, setComments] = React.useState<Comment[]>([])
        // const [postPublisher, setPostPublisher] = React.useState(null);
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
                fetchPostComments();
              }
        },[postId])
        // console.log("post")
        if (!post) {
            return (
                <Box>
                    <Text>Loading...</Text>
                </Box>
            );
        }
        //console.log("comm",comments)
        return(
            <Box w="100%" h="100vh" bgColor="#007958" paddingTop={2} display="flex" flexDirection="column">
                <Grid templateColumns="repeat(3,1fr)" h="8vh" w="90%" mx="auto">
                    <GridItem w="100%">
                        <Box display="flex" justifyContent="center" alignItems="center" h="100%">
                            <Link onClick={()=>router.back()} cursor="pointer">
                                <Text fontWeight="bold">Back</Text>
                            </Link>
                        </Box> 
                    </GridItem>
                    <GridItem>
                        <Box display="flex" justifyContent="center" alignItems="center" h="100%">
                            <Text fontSize={40} fontWeight="bold" textAlign="center" my="auto">Post Details</Text>
                        </Box>
                    </GridItem>
                    <GridItem w="100%">
                        <Box display="flex" justifyContent="center" alignItems="center" h="100%" gap={10}>
                            <Link href="/" margin={5}>
                                <Text fontWeight="bold">Home</Text>
                            </Link>
                            <Link href="/PostsList" margin={5}>
                                <Text fontWeight="bold">Posts List</Text>
                            </Link>
                            <Link href="/Users" margin={5}>
                                <Text fontWeight="bold">Users</Text>
                            </Link>
                        </Box> 
                    </GridItem>
                </Grid>
                <Box 
                    display="flex" 
                    flexDirection="column" 
                    overflowY="auto" 
                    maxHeight="calc(100vh - 10vh - 2 * 5vh - 20px)"  
                    width="90%" 
                    mx="auto" 
                    marginTop={5} 
                >
                    <Box maxH="100%" >
                        <Card
                            key={post?.id}
                            marginY={3} // Add margin to the top and bottom
                            minH="10vh"
                            overflow='hidden'
                            variant='outline'
                            border="1mm solid black"
                            borderRadius="5px"
                            bgColor="gray" 
                        >
                            <CardHeader>
                                <Text 
                                    fontWeight="bold" 
                                    fontSize="25px"
                                    padding={5}
                                >
                                    {post.title}
                                </Text>
                            </CardHeader>
                            <CardBody>
                                <Text 
                                // overflow="hidden"
                                // whiteSpace="nowrap"
                                // textOverflow="ellipsis"
                                padding={5}
                                >
                                {post.body}
                                </Text>
                            </CardBody>
                        </Card>
                    </Box>
                    <Text paddingY={5}>Comments</Text>
                    <Box maxH="100%" overflowY="auto">
                        {comments?.map(comm => (
                            <Card
                                key={comm.id}
                                marginY={3} // Add margin to the top and bottom
                                minH="10vh"
                                overflow='hidden'
                                variant='outline'
                                border="1mm solid black"
                                borderRadius="5px"
                                bgColor="gray" 
                            >
                            <CardHeader>
                                <Box display="flex" flexDirection="row" justifyContent="space-between">
                                    <Text 
                                        fontWeight="bold" 
                                        fontSize="25px"
                                        padding={5}
                                    >
                                        {comm.name} 
                                    </Text>
                                    <Text 
                                        fontWeight="bold" 
                                        fontSize="15px"
                                        padding={5}
                                        textAlign="center"
                                        alignSelf="center"
                                    >
                                        {comm.email} 
                                    </Text>
                                </Box>
                            </CardHeader>
                            <CardBody>
                                <Text 
                                    padding={5}
                                >
                                {comm.body}
                                </Text>
                            </CardBody>
                            </Card>
                        ))}
                        
                    </Box>
                </Box>
            </Box>
        )
}
