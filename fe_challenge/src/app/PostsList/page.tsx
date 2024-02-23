'use client'
import React from 'react';
import { 
  Box, 
  UnorderedList, 
  ListItem, 
  Text, 
  Button, 
  Stack, 
  Select, 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter} from '@chakra-ui/react';
import axios from 'axios';

interface Post {
  id: number;
  user_id: number;
  title: string;
  body: string;
}

export default function PostsList(){
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageLimit, setPageLimit] = React.useState(1);
  const [limit, setLimit] = React.useState('10');
  React.useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`https://gorest.co.in/public/v2/posts?page=${currentPage}&per_page=${Number(limit)}`);
        setPageLimit(Math.ceil(response.headers["x-pagination-total"]/Number(limit)));
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [posts, setPosts, currentPage, limit, setLimit]);
  const nextPage = React.useCallback(()=>{
    setCurrentPage((currentPage < pageLimit) ? currentPage + 1 : currentPage);
  }, [currentPage, setCurrentPage, pageLimit])
  const prevPage = React.useCallback(()=>{
    setCurrentPage((currentPage > 1) ? currentPage - 1 : currentPage);
  }, [currentPage, setCurrentPage])
  //console.log(pageLimit)
  console.log("post", posts)
  return (
    <Box w="100%" h="full" bgColor="green" paddingTop={5} display="flex" flexDirection="column">
      <Box padding={1} h="10vh">
        <Text fontSize={40} fontWeight="bold" textAlign="center">Blog Posts</Text>
      </Box>
      <Box 
        display="flex" 
        h="5vh" 
        w="100%"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Text fontSize={15} fontWeight="bold" textAlign="center" paddingRight={5} margin={2}>Items per Page</Text>
        <Select
          value={limit} 
          onChange={(e)=> {setLimit(e.target.value)}}
          w="10vh"
          h="5vh"
          mx="auto"
          variant="unstyled"
        >
          <option value='10' >10</option>
          <option value='20' >20</option>
          <option value='40' >40</option>
        </Select>
        <style jsx global>{`
        .chakra-select__icon-wrapper {
          display: none; /* Hide the icon wrapper */
        }
      `}</style>
      </Box>
        
      
      <Box display="block" overflowY="auto" h="76vh">
          {posts?.map(post => (
            <Card
              key={post.id}
              size="lg"
              overflow='hidden'
              variant='outline'
              //borderColor="black"
            >
              <CardHeader>
                <Text>{post.title}</Text>
              </CardHeader>
              {/* <CardBody>
                <Text>{post.body}</Text>
              </CardBody> */}
            </Card>
          ))}
        
      </Box>
      <Box display="flex" flexDirection="column" justifyContent="space-evenly" h="8vh">
        <Box display="flex" justifyContent="center">
          <Button margin={5} onClick={prevPage} size="md">Previous</Button>
          <Text fontSize={20} margin={5}>{currentPage}</Text>
          <Button margin={5} onClick={nextPage} size="md">Next</Button>
        </Box>
      </Box>
      
    </Box>
  );
};
