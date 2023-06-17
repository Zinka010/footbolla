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
} from "@chakra-ui/react";
import { Player } from "../types/types";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import playersJson from "../sample_data/players.json";

const PlayerList: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      // const data = await fetch(url + `?page=${pagination}`)
      // const result = await data.json();
      // setPlayers(result);

      setPlayers(playersJson);
    };

    fetchData();
  }, [page]);

  return (
    <>
      <Navbar homePage={true} />
      <Center minHeight="full" minWidth="100%" bg="gray.200">
        <Box
          minWidth="300px"
          width="2000px"
          bg="white"
          rounded="2xl"
          m={20}
          p={16}
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
                    <Tr>
                      <Td>{player.id}</Td>
                      <Td>{player.name}</Td>
                      <Td>{player.dob}</Td>
                      <Td>{player.height}</Td>
                      <Td>{player.weight}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Center>
    </>
  );
};

export default PlayerList;
