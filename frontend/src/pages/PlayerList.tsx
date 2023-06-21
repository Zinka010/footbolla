import {
  Box,
  Center,
  HStack,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Link,
  ButtonGroup,
  Button,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import usePlayers from "../hooks/usePlayers";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const PlayerList: React.FC = () => {
  const {
    players,
    fetchNextPageOfPlayers,
    fetchPreviousPageOfPlayers,
    isAtStart,
    isAtEnd,
  } = usePlayers();

  return (
    <>
      <Navbar homePage={true} />
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
            Players
          </Heading>
          <TableContainer width="100%">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Player ID</Th>
                  <Th>Name</Th>
                  <Th>Birthday</Th>
                  <Th>Height (cm)</Th>
                  <Th>Weight (kg)</Th>
                </Tr>
              </Thead>
              <Tbody>
                {players.map((player) => {
                  return (
                    <Tr key={player.player_id}>
                      <Td>{player.player_id}</Td>
                      <Td>{player.name}</Td>
                      <Td>{player.birthday}</Td>
                      <Td>{player.height}</Td>
                      <Td>
                        <HStack justifyContent="space-between">
                          <p>{player.weight}</p>
                          <Link href={`/player/${player.player_id}`}>View</Link>
                        </HStack>
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

export default PlayerList;
