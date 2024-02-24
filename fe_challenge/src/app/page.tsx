import Image from "next/image";
import styles from "./page.module.css";
import NextLink from 'next/link'
import { ChakraProvider, Link } from '@chakra-ui/react';
export default function Home() {
  return (
    <ChakraProvider>
      <Link as={NextLink} href="/PostsList">Blog Posts Lists</Link>
    </ChakraProvider>
  )
}
