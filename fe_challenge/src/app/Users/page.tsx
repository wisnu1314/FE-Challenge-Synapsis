'use client'
import React from 'react';
import axios from 'axios';
import { 
    Box,
    Grid, 
    GridItem, 
    Text, 
    Link, 
    Button,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableContainer,
    IconButton,
    Select } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

export class User{
    id:number = 0;
    name:string = '';
    email:string = '';
    gender:string = '';
    status:string = 'inactive';
}
export default function Users(){
    const [users, setUsers] = React.useState<User[]>([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageLimit, setPageLimit] = React.useState(1);
    const [limit, setLimit] = React.useState('10');
    const router = useRouter()
    const fetchData = React.useCallback(async () => {
        try {
          const response = await axios.get(`https://gorest.co.in/public/v2/users?page=${currentPage}&per_page=${Number(limit)}`);
          setUsers(response.data);
          setPageLimit(Math.ceil(response.headers["x-pagination-total"]/Number(limit)));
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }, [currentPage, limit]);

    const handleDelete = React.useCallback(async(id:number) => {
        try{
            await axios.delete(`https://gorest.co.in/public/v2/users/${id}`);
            setUsers(users.filter(user => user.id !== id))
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    },[users]) 

    const nextPage = React.useCallback(()=>{
        setCurrentPage((currentPage < pageLimit) ? currentPage + 1 : currentPage);
    }, [currentPage, setCurrentPage, pageLimit])
    const prevPage = React.useCallback(()=>{
        setCurrentPage((currentPage > 1) ? currentPage - 1 : currentPage);
    }, [currentPage, setCurrentPage])
    console.log("users", users)
    React.useEffect(()=>{
        fetchData();
    },)
    return(
        <Box w="100%" h="100vh" bgColor="green" paddingTop={2} display="flex" flexDirection="column">
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
                        <Text fontSize={40} fontWeight="bold" textAlign="center" my="auto">Users</Text>
                    </Box>
                </GridItem>
                <GridItem w="100%">
                    <Box display="flex" justifyContent="center" alignItems="center" h="100%">
                        <Link href="/" margin={5}>
                            <Text fontWeight="bold">Home</Text>
                        </Link>
                        <Link href="/PostsList" margin={5}>
                            <Text fontWeight="bold">Posts List</Text>
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
                justifyContent="center"
                overflowY="auto" 
                maxHeight="calc(100vh - 10vh - 2 * 5vh - 20px)"  
                width="90%" 
                mx="auto" 
                marginTop={5}
                bg="gray"
                borderRadius="md"
                flexDirection="column"
            >
                <Grid 
                    templateColumns="repeat(12, 1fr)" 
                    gap={2} 
                    borderBottomWidth="1px" 
                    borderColor="gray.200" 
                    p={2} 
                    alignContent="center" 
                    justifyContent="center"
                    marginY={5} 
                > {/* Set up grid layout */}
                    <GridItem gridColumn="span 1" textAlign="center">No</GridItem>
                    <GridItem gridColumn="span 3" textAlign="center">Name</GridItem> {/* Double-width column */}
                    <GridItem gridColumn="span 5" textAlign="center">Email</GridItem> {/* Double-width column */}
                    <GridItem gridColumn="span 1" textAlign="center">Gender</GridItem>
                    <GridItem gridColumn="span 2" textAlign="center">Action</GridItem>
                </Grid>
                <Box overflowY="auto" flex="1"> {/* Ensure the body is scrollable */}
                    {users.map((user, index) => (
                        <Grid 
                            key={user.id} 
                            templateColumns="repeat(12, 1fr)" 
                            gap={2}
                            marginY={5} 
                            p={2} 
                            borderBottomWidth="1px" 
                            borderColor="gray.200" 
                            alignItems="center" 
                            justifyContent="center"
                        > 
                            <GridItem gridColumn="span 1" textAlign="center">{(Number(limit)*(currentPage - 1))+index + 1}</GridItem>
                            <GridItem gridColumn="span 3" textAlign="center">{user.name}</GridItem> {/* Double-width column */}
                            <GridItem gridColumn="span 5" textAlign="center">{user.email}</GridItem> {/* Double-width column */}
                            <GridItem gridColumn="span 1" textAlign="center">{user.gender}</GridItem>
                            <GridItem gridColumn="span 2" display="flex" justifyContent="center">
                                <IconButton
                                    colorScheme="blue"
                                    aria-label="Edit"
                                    icon={<EditIcon />}
                                    mr={2}
                                    //onClick={() => onEdit(user.id)}
                                />
                                <IconButton
                                    colorScheme="red"
                                    aria-label="Delete"
                                    icon={<DeleteIcon />}
                                    //onClick={() => onDelete(user.id)}
                                />
                            </GridItem>
                        </Grid>
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
}