import Image from "next/image";
import styles from "./page.module.css";
import NextLink from 'next/link'
import { Box, Button, ChakraProvider, Link, Text } from '@chakra-ui/react';
export default function Home() {
  return (
    <ChakraProvider>
      <Box 
        w="100%" 
        h="100vh" 
        bgColor="#007958" 
        paddingTop={2} 
        display="flex" 
        flexDirection="column"
        justifyContent="center"
      >
        <Box 
          display="flex"
          w="100%"
          justifyContent="center"
          
        >
          <Text
            fontWeight="bold"
            fontSize={48}
          >
            Front End Challenge Synapsis.id 2024
            </Text>
        </Box>
        <Button 
          as={NextLink}
          w="90%"
          h="20%"
          mx="auto"
          my="10"
          href="/PostsList"
        >
          <Text
            fontWeight="bold"
            fontSize={36}
          >
            Blog Posts Lists
          </Text>
        </Button>
        <Button
          as={NextLink}
          w="90%"
          mx="auto"
          my={10}
          h="20%"
          href="/Users"
        >
          <Text
            fontWeight="bold"
            fontSize={36}
          >
            Users
          </Text>
        </Button>
        
        
      </Box>
      
    </ChakraProvider>
  )
}
