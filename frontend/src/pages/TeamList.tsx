import {
    Box,
    Center,
    Heading,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    ButtonGroup,
    Button,
    Link
  } from "@chakra-ui/react";
  import Navbar from "../components/Navbar";
  import useTeams from "../hooks/useTeams";
  import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
  
  const TeamList: React.FC = () => {
    const {
      teams,
      fetchNextPageOfPlayers,
      fetchPreviousPageOfPlayers,
      isAtStart,
      isAtEnd,
    } = useTeams();
  
    return (
      <>
        <Navbar />
        <Center minHeight="100%" minWidth="100%" bg="gray.200">
          <Box
            minWidth="300px"
            width="2000px"
            bg="white"
            rounded="2xl"
            m={20}
            p={16}
            textAlign={"left"}
          >
            <Heading size="3xl" mb={10}>
              Teams
            </Heading>
            <TableContainer width="100%">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Team ID</Th>
                    <Th>Team Short Name</Th>
                    <Th>Team Long Name</Th>
                    {/* Empty Th tags to ensure the horiztonal line also covers the link rows */}
                    <Th></Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {teams.map((team) => {
                    return (
                      <Tr key={team.team_id}>
                        <Td>{team.team_id}</Td>
                        <Td>{team.team_short_name}</Td>
                        <Td>{team.team_long_name}</Td>

                        <Td>
                            <Link 
                            style={{textDecorationLine: 'underline'}} 
                            href={`/team/${team.team_id}`}>
                                More Info
                            </Link>
                        </Td>
                        <Td>
                            <Link 
                            style={{textDecorationLine: 'underline'}} 
                            href={`/roster/${team.team_id}`}>
                                Roster
                            </Link>
                        </Td>
                        
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
            <Center mt={10}>
              <ButtonGroup isAttached variant={"outline"}>
                <Button
                  isDisabled={isAtStart}
                  leftIcon={<ChevronLeftIcon />}
                  onClick={fetchPreviousPageOfPlayers}
                >
                  Prev
                </Button>
                <Button
                  isDisabled={isAtEnd}
                  rightIcon={<ChevronRightIcon />}
                  onClick={fetchNextPageOfPlayers}
                >
                  Next
                </Button>
              </ButtonGroup>
            </Center>
          </Box>
        </Center>
      </>
    );
  };
  
  export default TeamList;
  