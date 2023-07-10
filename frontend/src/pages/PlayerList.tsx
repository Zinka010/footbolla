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
  Input,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import usePlayers from "../hooks/usePlayers";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { SearchBar } from "../components/SearchBar";
import { debounce } from "lodash";
import { useFilterSearch } from "../hooks/useFilterSearch";
import { PlayerPositions } from "../util/CONSTANTS"

let switcher = false;

const PlayerList: React.FC = () => {
  const {
    players,
    fetchNextPageOfPlayers,
    fetchPreviousPageOfPlayers,
    isAtStart,
    isAtEnd,
  } = usePlayers();

  const { 
    playerResults: playerResults, 
    filterSearch: playerFilterSearch,
    fetchNextPageOfPlayersFilter,
    fetchPreviousPageOfPlayersFilter,
    isAtStartFilter,
    isAtEndFilter
  } = useFilterSearch();

  interface IFilters {
    team: string,
    league: string,
    position: PlayerPositions | number,
    playerName: string,
    rating: boolean,
    speed: boolean,
  };

  const filters: IFilters = {
    team: "",
    league: "",
    position: -1,
    playerName: "",
    rating: false,
    speed: false
  }

  const handleFilterSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === ""){
      switcher = false;
    } else {
      switcher = true;
      debouncedSearch(e.target.value);
    }
    console.log(switcher + " " + e.target.value);
  }

  const debouncedSearch = debounce((target: string) => {
    filters.playerName = target;
    playerFilterSearch(filters.team, filters.league, filters.position, filters.playerName, filters.rating, filters.speed);
  });

  const handleClickNext = () => {
    fetchNextPageOfPlayersFilter();
    playerFilterSearch(filters.team, filters.league, filters.position, filters.playerName, filters.rating, filters.speed);
  }

  const handleClickPrev = () => {
    fetchPreviousPageOfPlayersFilter();
    playerFilterSearch(filters.team, filters.league, filters.position, filters.playerName, filters.rating, filters.speed);
  }

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
          mt={5}
          p={16}
          textAlign={"left"}
        >
          <Heading size="3xl" mb={10}>
            Players
          </Heading>
          <Box
            minWidth="50px"
            width="300px"
            bg="white"
            rounded="2xl"
            m={1}
            p={2}
          >
            <SearchBar typeOnChange={handleFilterSearch} />
          </Box>
          <TableContainer width="100%">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Player ID</Th>
                  <Th>Name</Th>
                  <Th>Birthday</Th>
                  <Th>Height (cm)</Th>
                  <Th>Weight (lbs)</Th>
                </Tr>
              </Thead>
              <Tbody>
                {(switcher ? playerResults : players).map((player) => {
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
                isDisabled={switcher ? isAtStartFilter : isAtStart}
                leftIcon={<ChevronLeftIcon />}
                onClick={switcher ? handleClickPrev : fetchPreviousPageOfPlayers}
              >
                Prev
              </Button>
              <Button
                isDisabled={switcher ? isAtEndFilter : isAtEnd}
                rightIcon={<ChevronRightIcon />}
                onClick={switcher ? handleClickNext : fetchNextPageOfPlayers}
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
