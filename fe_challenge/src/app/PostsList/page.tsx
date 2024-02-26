/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React from 'react';
import { 
  Box, 
  Link, 
  Text, 
  Button, 
  Select, 
  Card, 
  CardHeader, 
  CardBody, 
  Grid,
  GridItem} from '@chakra-ui/react';
import axios from 'axios';

// export class Post {
//   id: number = 0;
//   user_id: number = 0;
//   title: string = '';
//   body: string = '';
// }
interface Post {
    id: number,
    user_id: number,
    title: string,
    body: string,
  }

export default function PostsList(){
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageLimit, setPageLimit] = React.useState(1);
  const [limit, setLimit] = React.useState('10');

  const fetchPosts = React.useCallback(async()=>{
    try {
          const response = await axios.get(`https://gorest.co.in/public/v2/posts?page=${currentPage}&per_page=${Number(limit)}`);
          setPageLimit(Math.ceil(response.headers["x-pagination-total"]/Number(limit)));
          setPosts(response.data);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
  },[currentPage, limit])
  function debounce(func: (...args: any[]) => void, delay: number): (...args: any[]) => void {
    let timer: NodeJS.Timeout; // Type annotation for timer
    return function(this: any, ...args: any[]): void { 
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }
  const debouncedFetchPosts = React.useCallback(
    debounce(fetchPosts, 250), // Adjust debounce delay as needed
    [currentPage, limit]
);
  React.useEffect(() => {
    debouncedFetchPosts();
  }, [debouncedFetchPosts]);
  const nextPage = React.useCallback(()=>{
    setCurrentPage((currentPage < pageLimit) ? currentPage + 1 : currentPage);
  }, [currentPage, setCurrentPage, pageLimit])
  const prevPage = React.useCallback(()=>{
    setCurrentPage((currentPage > 1) ? currentPage - 1 : currentPage);
  }, [currentPage, setCurrentPage])
  //console.log(pageLimit)
  console.log("post", posts)
  return (
    <Box w="100%" h="100vh" bgColor="#007958" paddingTop={2} display="flex" flexDirection="column">
      <Grid templateColumns="repeat(3,1fr)" h="8vh" w="90%" mx="auto">
        <GridItem w="100%">
        </GridItem>
        <GridItem>
          <Box display="flex" justifyContent="center" alignItems="center" h="100%">
            <Text fontSize={40} fontWeight="bold" textAlign="center" my="auto">Blog Posts</Text>
          </Box>
        </GridItem>
        <GridItem w="100%">
          <Box display="flex" justifyContent="center" alignItems="center" h="100%" gap={10}>
            <Link href="/">
              <Text fontWeight="bold">Home</Text>
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
        justifyContent="center" 
        alignItems="center"
        width="100%"
        marginTop={4} 
      >
        <Text fontSize={15} fontWeight="bold" textAlign="center"paddingRight={5} marginY={2}>Items per Page</Text>
        <Select
          value={limit} 
          onChange={(e)=> {setLimit(e.target.value)}}
          w="10vh"
          h="5vh"
          variant="unstyled"
          marginY={2}
          paddingLeft={4}
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
      <Box 
        display="flex" 
        flexDirection="column" 
        overflowY="auto" 
        maxHeight="calc(100vh - 10vh - 2 * 5vh - 20px)"  
        width="90%" 
        mx="auto" 
        marginTop={5} 
      >
        <Box 
          maxHeight="100%" 
          overflowY="scroll" 
          sx={{
            "&::-webkit-scrollbar": {
              width: "0px",
            },
          }} 
        >
          {posts?.map(post => (
            <Card
              key={post.id}
              marginY={3} // Add margin to the top and bottom
              minH="10vh"
              maxH="11vh"
              overflow='hidden'
              variant='outline'
              border="1mm solid black"
              borderRadius="5px"
              bgColor="gray" 
            >
              <CardHeader>
                <Link href={`/PostsList/${post.id}`}>
                  <Text 
                    fontWeight="bold" 
                    fontSize="25px"
                    padding={5}
                  >
                    {post.title}
                  </Text>
                </Link>
                
              </CardHeader>
              <CardBody>
                <Text 
                  overflow="hidden"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                  padding={5}
                >
                  {post.body}
                  </Text>
              </CardBody>
            </Card>
          ))}
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" h="5vh" mx="auto">
        <Box display="flex" justifyContent="center" alignItems="center">
          <Button margin={5} onClick={prevPage} size="lg">Prev</Button>
          <Text fontSize={20} margin={5}>{currentPage}</Text>
          <Button margin={5} onClick={nextPage} size="lg">Next</Button>
        </Box>
      </Box>
    </Box>
  );
};
