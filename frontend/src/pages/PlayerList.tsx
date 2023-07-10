import {
  Box,
  Center,
  Checkbox,
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
import { SearchBar } from "../components/SearchBar";
import { debounce } from "lodash";
import { useFilterSearch } from "../hooks/useFilterSearch";
import { useState } from "react"

interface IFilters {
  team: string,
  league: string,
  playerName: string,
  rating: boolean,
  speed: boolean,
  age: boolean,
};

const filters: IFilters = {
  team: "",
  league: "",
  playerName: "",
  rating: false,
  speed: false,
  age: false,
}

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

  const [switcher, userSwitcher] = useState(0);

  const handleFilterSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value == ""){
      filters.playerName = e.target.value;
      userSwitcher(switcher - 1);
    } else {
      if (filters.playerName.length === 0){
        userSwitcher(switcher + 1);
      }
      filters.playerName = e.target.value;
      debouncedUpdateFilter();
    }
  }

  const handleFilterRating = (e: React.ChangeEvent<HTMLInputElement>) => {
    filters.rating = e.target.checked;
    handleCheckbox(e.target.checked);
  }

  const handleFilterSpeed = (e: React.ChangeEvent<HTMLInputElement>) => {
    filters.speed = e.target.checked;
    handleCheckbox(e.target.checked);
  }

  const handleFilterAge = (e: React.ChangeEvent<HTMLInputElement>) => {
    filters.age = e.target.checked;
    handleCheckbox(e.target.checked);
  }

  const handleCheckbox = (target: boolean) => {
    if (target){
      userSwitcher(switcher + 1);
      debouncedUpdateFilter();
    } else {
      userSwitcher(switcher - 1);
      if (switcher > 0){
        debouncedUpdateFilter();
      }
    }
  }

  const debouncedUpdateFilter = debounce(() => {
    playerFilterSearch(filters.team, filters.league, filters.playerName, filters.rating, filters.speed, filters.age);
  });

  const handleClickNext = () => {
    fetchNextPageOfPlayersFilter();
    playerFilterSearch(filters.team, filters.league, filters.playerName, filters.rating, filters.speed, filters.age);
  }

  const handleClickPrev = () => {
    fetchPreviousPageOfPlayersFilter();
    playerFilterSearch(filters.team, filters.league, filters.playerName, filters.rating, filters.speed, filters.age);
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
            width="1200px"
            bg="white"
            rounded="2xl"
            style={{ display: "flex" }}
            m={1}
            p={2}
          >
            <SearchBar typeOnChange={handleFilterSearch} />
            {/* <Select variant="outline" style={{ marginLeft: "5px", marginRight: "15px"}} defaultValue={-1} onChange={handleFilterPosition}>
                <option value={-1}>Select position...</option>
                <option value={PlayerPositions.GOALKEEPER}>{positionMap[PlayerPositions.GOALKEEPER]}</option>
                <option value={PlayerPositions.RIGHT_BACK}>{positionMap[PlayerPositions.RIGHT_BACK]}</option>
                <option value={PlayerPositions.RIGHT_CENTER_BACK}>{positionMap[PlayerPositions.RIGHT_CENTER_BACK]}</option>
                <option value={PlayerPositions.LEFT_CENTER_BACK}>{positionMap[PlayerPositions.LEFT_CENTER_BACK]}</option>
                <option value={PlayerPositions.LEFT_BACK}>{positionMap[PlayerPositions.LEFT_BACK]}</option>
                <option value={PlayerPositions.RIGHT_MIDFIELDER}>{positionMap[PlayerPositions.RIGHT_MIDFIELDER]}</option>
                <option value={PlayerPositions.CENTER_MIDFIELDER}>{positionMap[PlayerPositions.CENTER_MIDFIELDER]}</option>
                <option value={PlayerPositions.LEFT_MIDFIELDER}>{positionMap[PlayerPositions.LEFT_MIDFIELDER]}</option>
                <option value={PlayerPositions.RIGHT_FORWARD}>{positionMap[PlayerPositions.RIGHT_FORWARD]}</option>
                <option value={PlayerPositions.CENTER_FORWARD}>{positionMap[PlayerPositions.CENTER_FORWARD]}</option>
                <option value={PlayerPositions.LEFT_FORWARD}>{positionMap[PlayerPositions.LEFT_FORWARD]}</option>
            </Select> */}
            <Checkbox onChange={handleFilterRating} style={{ width: "450px", marginLeft: "15px"}}>Order by Ranking</Checkbox>
            <Checkbox onChange={handleFilterSpeed} style={{ width: "450px", marginRight: "15px"}}>Order by Speed</Checkbox>
            <Checkbox onChange={handleFilterAge} style={{ width: "450px", marginRight: "15px"}}>Order by Age</Checkbox>
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
                {(switcher > 0 ? playerResults : players).map((player) => {
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
                isDisabled={switcher > 0 ? isAtStartFilter : isAtStart}
                leftIcon={<ChevronLeftIcon />}
                onClick={switcher > 0 ? handleClickPrev : fetchPreviousPageOfPlayers}
              >
                Prev
              </Button>
              <Button
                isDisabled={switcher > 0 ? isAtEndFilter : isAtEnd}
                rightIcon={<ChevronRightIcon />}
                onClick={switcher > 0 ? handleClickNext : fetchNextPageOfPlayers}
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
