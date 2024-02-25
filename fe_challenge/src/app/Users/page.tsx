/* eslint-disable react-hooks/exhaustive-deps */
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
    IconButton,
    InputGroup,
    Input,
    Select, 
    Tooltip,
    Modal,
    ModalBody,
    ModalFooter,
    ModalContent,
    ModalOverlay,
    useDisclosure,
    ModalCloseButton,
    ModalHeader,
    FormControl,
    FormLabel} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

const token = 'ec5c7ec776880b8d7ee7bc7643f8038a45450a7c5d3a339671900ec470d83b31'

interface User{
    id:number,
    name:string,
    email:string,
    gender:string,
    status:string,
}
export default function Users(){
    const [users, setUsers] = React.useState<User[]>([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageLimit, setPageLimit] = React.useState(1);
    const [limit, setLimit] = React.useState('10');
    const [userMode, setUserMode] = React.useState('edit');

    //Queries
    const [nameQuery, setNameQuery] = React.useState('');
    const [genderQuery, setGenderQuery] = React.useState('all');
    const [statusQuery, setStatusQuery] = React.useState('all');

    //Input
    const [nameInput, setNameInput] = React.useState('');
    const [emailInput, setEmailInput] = React.useState('');
    const [genderInput, setGenderInput] = React.useState('male');
    const [statusInput, setStatusInput] = React.useState('active');
    const [userId, setUserId] = React.useState(0);

    //Additional
    const router = useRouter()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)

    const fetchData = React.useCallback(async () => {
        try {
          const response = await axios.get(
            `https://gorest.co.in/public/v2/users?name=${nameQuery}&gender=${genderQuery === 'all' ? '' : genderQuery}&status=${statusQuery === 'all' ? '' : statusQuery}&page=${currentPage}&per_page=${Number(limit)}`
            );
          setUsers(response.data);
          setPageLimit(Math.ceil(response.headers["x-pagination-total"]/Number(limit)));
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }, [currentPage, genderQuery, limit, nameQuery, statusQuery]);

    const handleDelete = React.useCallback(async(id:number) => {
        const token = 'ec5c7ec776880b8d7ee7bc7643f8038a45450a7c5d3a339671900ec470d83b31'
        try{
            await axios.delete(`https://gorest.co.in/public/v2/users/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            });
            setUsers(users.filter(user => user.id !== id))
            debouncedFetchData();
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    },[users]) 

    const handleCreate = React.useCallback(async(name:string, email:string, gender:string) => {
        try{
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };
            const userData = {
                name: name,
                email: email,
                gender: gender,
                status: 'active'
            };
            const response = await axios.post(`https://gorest.co.in/public/v2/users`, userData, {headers});
            console.log('User Created', response.data)
        } catch (error) {
          console.error('Error creating user:', error);
        } finally {
            onCloseModal(); 
        }
    },[token])

    const handleEdit = React.useCallback(async(id:number, name:string, email:string, gender:string, status:string) => {
        try{
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };
            const userData = {
                name: name,
                email: email,
                gender: gender,
                status: status
            };
            const response = await axios.patch(`https://gorest.co.in/public/v2/users/${id}`, userData, {headers});
            console.log('User Edited', response.data)
        } catch (error) {
          console.error('Error creating user:', error);
        } finally {
            onCloseModal(); 
        }
    },[token])

    const onCloseModal = React.useCallback(()=>{
        setNameInput('');
        setEmailInput('');
        setGenderInput('male');
        setStatusInput('active');
        setUserMode('edit');
        setUserId(0);
        onClose();
    },[])
    
    const isAccountValid = React.useCallback(()=>{
        if(!emailInput.match(/^\S+@\S+\.\S+$/)){
            return false;
          }
        if(nameInput === ''){
            return false;
        }
        return true;
    },[emailInput, nameInput])

    const nextPage = React.useCallback(()=>{
        setCurrentPage((currentPage < pageLimit) ? currentPage + 1 : currentPage);
    }, [currentPage, setCurrentPage, pageLimit])
    const prevPage = React.useCallback(()=>{
        setCurrentPage((currentPage > 1) ? currentPage - 1 : currentPage);
    }, [currentPage, setCurrentPage])

    function debounce(func: (...args: any[]) => void, delay: number): (...args: any[]) => void {
        let timer: NodeJS.Timeout; // Type annotation for timer
        return function(this: any, ...args: any[]): void { 
          clearTimeout(timer);
          timer = setTimeout(() => {
            func.apply(this, args);
          }, delay);
        };
      }
    const debouncedFetchData = React.useCallback(
        debounce(fetchData, 500), // Adjust debounce delay as needed
        [nameQuery, genderQuery, statusQuery, currentPage, limit]
    );
    
    React.useEffect(()=>{
        debouncedFetchData();
        
    },[debouncedFetchData])
    // console.log("token", isAccountValid())
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
                    bg="white"
                    textColor="black"
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
                aria-label='search-bar'
                display="flex"
                justifyContent="center"
                flexDirection="row"
                marginTop={3}
                mx="auto"
                w="100%"
            >
                <Grid 
                    templateColumns="repeat(5,1fr)" 
                    h="5vh" 
                    w="90%" 
                    mx="auto" 
                    gap={2} 
                    // p={2} 
                    alignContent="center" 
                    justifyContent="center"
                >
                    <GridItem gridColumn="span 3">
                        <InputGroup h="5vh">
                            <Input 
                                bg="white"
                                type='string' 
                                w="100%" 
                                h="100%"
                                fontSize={15}
                                placeholder='Name'
                                textColor="black"
                                value={nameQuery}
                                onChange={(e)=> setNameQuery(e.target.value)}
                            >
                            </Input>
                        </InputGroup>
                    </GridItem>
                    <GridItem gridColumn="span 2" >
                        <InputGroup w="100%" h="5vh" display="flex" justifyContent="center">
                            <Select
                                value={genderQuery} 
                                onChange={(e)=> {setGenderQuery(e.target.value)}}
                                variant="unstyled"
                                w="20vh"
                                h="5vh"
                                bg="white"
                                textColor="black"
                            >
                                <option value='all' >Gender: All</option>
                                <option value='male' >Gender: Male</option>
                                <option value='female'>Gender: Female</option>
                            </Select>
                            <Select
                                value={statusQuery} 
                                onChange={(e)=> {setStatusQuery(e.target.value)}}
                                variant="unstyled"
                                w="20vh"
                                h="5vh"
                                bg="white"
                                textColor="black"
                                paddingLeft={4}
                            >
                                <option value='all' >Status: All</option>
                                <option value='active' >Status: Active</option>
                                <option value='inactive'>Status: Inactive</option>
                            </Select>
                        </InputGroup>
                    </GridItem>
                    
                </Grid>
                    
            </Box>
            <Box
                aria-label='add-user'
                display="flex"
                justifyContent="center"
                marginTop={5}
            >
                <Button 
                    w="90%" 
                    h="5vh" 
                    bg='blue' 
                    onClick={()=>{
                        setUserMode('create')
                        onOpen();
                    }}
                >
                    <Text fontWeight="bold">Add User</Text>
                </Button>
                
                
            </Box>
            <Box
                aria-label='table'
                display="flex" 
                justifyContent="center"
                overflowY="auto" 
                maxHeight="calc(90vh - 10vh - 2 * 5vh - 20px)"  
                width="90%" 
                mx="auto" 
                marginTop={5}
                bg="gray"
                borderRadius="md"
                flexDirection="column"
                border="1mm solid black"
            >
                <>
                    <Modal
                        initialFocusRef={initialRef}
                        finalFocusRef={finalRef}
                        isOpen={isOpen}
                        onClose={()=> {
                            onCloseModal();
                        }}
                        isCentered
                    >
                        <ModalOverlay />
                        <ModalContent margin={5} >
                            <Box 
                                display="flex" 
                                w="50%" 
                                minH="50vh" 
                                bg="white" 
                                flexDirection="column" 
                                alignContent="center" 
                                mx="auto"
                                my="5%"
                                textColor="black"
                                border="1mm solid black" borderRadius="4px"
                            >
                                <ModalHeader margin={10}>
                                    {userMode === 'create' && (
                                        <Text>Create Accout</Text>
                                    )}
                                    {userMode === 'edit' && (
                                        <Text>Edit Accout</Text>
                                    )}
                                </ModalHeader>
                                
                                <ModalBody>
                                    <FormControl  margin={10}>
                                        <FormLabel my={10}>Name</FormLabel>
                                            <InputGroup h="5vh">
                                                <Input 
                                                    bg="white"
                                                    type='string' 
                                                    w="100%" 
                                                    h="100%"
                                                    fontSize={15}
                                                    placeholder='Name'
                                                    textColor="black"
                                                    value={nameInput}
                                                    onChange={(e) => setNameInput(e.target.value)}
                                                >
                                            </Input>
                                        </InputGroup>
                                    </FormControl>
                                    <FormControl  margin={10}>
                                        <FormLabel my={10}>Email</FormLabel>
                                            <InputGroup h="5vh">
                                                <Input 
                                                    bg="white"
                                                    type='email' 
                                                    w="100%" 
                                                    h="100%"
                                                    fontSize={15}
                                                    placeholder='Email'
                                                    textColor="black"
                                                    value={emailInput}
                                                    onChange={(e) => {setEmailInput(e.target.value)}}
                                                    focusBorderColor='red.300'
                                                >
                                            </Input>
                                        </InputGroup>
                                    </FormControl>
                                    <FormControl  margin={10}>
                                        <FormLabel my={10}>Gender</FormLabel>
                                            <InputGroup w="100%" h="5vh">
                                            <Select
                                                value={genderInput} 
                                                onChange={(e)=> {setGenderInput(e.target.value)}}
                                                variant="unstyled"
                                                h="5vh"
                                                bg="white"
                                                textColor="black"
                                            >
                                                <option value='male' >Male</option>
                                                <option value='female'>Female</option>
                                            </Select>
                                        </InputGroup>
                                    </FormControl>
                                    {userMode === 'edit' && (
                                        <FormControl  margin={10}>
                                            <FormLabel my={10}>Gender</FormLabel>
                                                <InputGroup w="100%" h="5vh">
                                                    <Select
                                                        value={statusInput} 
                                                        onChange={(e)=> {setStatusInput(e.target.value)}}
                                                        variant="unstyled"
                                                        h="5vh"
                                                        bg="white"
                                                        textColor="black"
                                                    >
                                                        <option value='active' >Active</option>
                                                        <option value='inactive'>Inactive</option>
                                                    </Select>
                                                </InputGroup>
                                    </FormControl>
                                    )}
                                </ModalBody>

                                <ModalFooter>
                                    <Box 
                                        display="flex" 
                                        justifyContent="center" 
                                        flexDirection="column"
                                        w="100%"
                                        h="10vh"
                                        mx="auto"
                                        gap={10}
                                    >
                                        <Button 
                                            bg={!isAccountValid() ? "red" : "blue"}
                                            cursor={!isAccountValid() ? "not-allowed" : "pointer"}
                                            w="95%"
                                            h="4vh" 
                                            mx="auto"
                                            isDisabled={!isAccountValid()}
                                            fontWeight="bold"
                                            onClick={()=>{
                                                if(userMode === 'create'){
                                                    handleCreate(nameInput, emailInput, genderInput)
                                                }
                                                else{
                                                    handleEdit(userId, nameInput, emailInput, genderInput, statusInput)
                                                    fetchData()
                                                }
                                                
                                            }}
                                        >
                                            Submit
                                        </Button>
                                        <Button 
                                            onClick={onCloseModal} 
                                            cursor="pointer"
                                            w="95%"
                                            h="4vh" 
                                            mx="auto"
                                        >
                                            Cancel
                                        </Button>
                                    </Box>
                                    
                                </ModalFooter>
                            </Box>
                            
                        </ModalContent>
                    </Modal>
                </>
                <Grid 
                    templateColumns="repeat(12, 1fr)" 
                    gap={2} 
                    
                    p={2} 
                    alignContent="center" 
                    justifyContent="center"
                    marginY={5} 
                > {/* Set up grid layout */}
                    <GridItem gridColumn="span 1" textAlign="center">No</GridItem>
                    <GridItem gridColumn="span 3" textAlign="center" borderLeft="1mm solid black">Name</GridItem> {/* Double-width column */}
                    <GridItem gridColumn="span 5" textAlign="center" borderLeft="1mm solid black">Email</GridItem> {/* Double-width column */}
                    <GridItem gridColumn="span 1" textAlign="center" borderLeft="1mm solid black">Gender</GridItem>
                    <GridItem gridColumn="span 2" textAlign="center" borderLeft="1mm solid black">Action</GridItem>
                </Grid>
                <Box 
                    overflowY="auto" 
                    flex="1"
                    sx={{
                        "&::-webkit-scrollbar": {
                            width: "0px",
                        },
                    }} 
                > {/* Ensure the body is scrollable */}
                    {users.map((user, index) => (
                        <Grid 
                            key={user.id} 
                            templateColumns="repeat(12, 1fr)" 
                            gap={2}
                            marginTop={5}
                            p={2} 
                            alignItems="center" 
                            justifyContent="center"
                            borderTop={index === 0 ? "1mm solid black" : "none"}
                            borderBottom={index + 1 < Number(limit) ? "1mm solid black" : "none"}
                            bg={user.status === 'active' ? 'green' : 'red'}
                        > 
                            <GridItem gridColumn="span 1" textAlign="center">{(Number(limit)*(currentPage - 1))+index + 1}</GridItem>
                            <GridItem gridColumn="span 3" textAlign="center" borderLeft="1mm solid black">{user.name}</GridItem> 
                            <GridItem gridColumn="span 5" textAlign="center" borderLeft="1mm solid black">{user.email}</GridItem> 
                            <GridItem gridColumn="span 1" textAlign="center" borderLeft="1mm solid black">{user.gender}</GridItem>
                            <GridItem gridColumn="span 2" display="flex" justifyContent="center" borderLeft="1mm solid black">
                                <Tooltip label='Edit User' bg='black' placement='left-start'>
                                    <IconButton
                                        colorScheme="blue"
                                        aria-label="Edit"
                                        icon={<EditIcon />}
                                        mr={2}
                                        onClick={()=>{
                                            setUserMode('edit');
                                            setUserId(user.id);
                                            setNameInput(user.name);
                                            setEmailInput(user.email);
                                            setGenderInput(user.gender);
                                            setStatusInput(user.status);
                                            onOpen();
                                        }}
                                    />
                                </Tooltip>
                                
                                <Tooltip label='Delete User' bg='black' placement='right-end'>
                                    <IconButton
                                        colorScheme="transparent"
                                        aria-label="Delete"
                                        icon={<DeleteIcon />}
                                        onClick={() => handleDelete(user.id)}
                                    />
                                </Tooltip>
                                
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