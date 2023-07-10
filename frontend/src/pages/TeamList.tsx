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
  Link,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import useTeams from "../hooks/useTeams";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { SearchBar } from "../components/SearchBar";
import { debounce } from "lodash";
import { useFilterSearch } from "../hooks/useFilterSearch";
import { useState } from "react";

interface IFilters {
  team: string;
  league: string;
  playerName: string;
  rating: boolean;
  speed: boolean;
  age: boolean;
}

const filters: IFilters = {
  team: "",
  league: "",
  playerName: "",
  rating: false,
  speed: false,
  age: false,
};

const TeamList: React.FC = () => {
  const {
    teams,
    fetchNextPageOfPlayers,
    fetchPreviousPageOfPlayers,
    isAtStart,
    isAtEnd,
  } = useTeams();

  const {
    teamResults: teamResults,
    filterSearch: playerFilterSearch,
    fetchNextPageOfPlayersFilter,
    fetchPreviousPageOfPlayersFilter,
    isAtStartFilter,
    isAtEndFilter,
  } = useFilterSearch();

  const [switcher, userSwitcher] = useState(false);

  const handleFilterSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    filters.team = e.target.value;
    if (e.target.value == "") {
      userSwitcher(false);
    } else {
      userSwitcher(true);
      debouncedUpdateFilter();
    }
  };

  const debouncedUpdateFilter = debounce(() => {
    playerFilterSearch(
      filters.team,
      filters.league,
      filters.playerName,
      filters.rating,
      filters.speed,
      filters.age
    );
  }, 500);

  const handleClickNext = () => {
    fetchNextPageOfPlayersFilter();
    playerFilterSearch(
      filters.team,
      filters.league,
      filters.playerName,
      filters.rating,
      filters.speed,
      filters.age
    );
  };

  const handleClickPrev = () => {
    fetchPreviousPageOfPlayersFilter();
    playerFilterSearch(
      filters.team,
      filters.league,
      filters.playerName,
      filters.rating,
      filters.speed,
      filters.age
    );
  };

  return (
    <>
      <Navbar />
      <Center minHeight="100vh" minWidth="100%" bg="gray.200">
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
          <Box
            minWidth="50px"
            width="400px"
            bg="white"
            rounded="2xl"
            style={{ display: "flex" }}
            m={1}
            p={2}
          >
            <SearchBar typeOnChange={handleFilterSearch} />
          </Box>
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
                {(switcher ? teamResults : teams).map((team) => {
                  return (
                    <Tr key={team.team_id}>
                      <Td>{team.team_id}</Td>
                      <Td>{team.team_short_name}</Td>
                      <Td>{team.team_long_name}</Td>

                      <Td>
                        <Link
                          style={{ textDecorationLine: "underline" }}
                          href={`/team/${team.team_id}`}
                        >
                          More Info
                        </Link>
                      </Td>
                      <Td>
                        <Link
                          style={{ textDecorationLine: "underline" }}
                          href={`/roster/${team.team_id}`}
                        >
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
                isDisabled={switcher ? isAtStartFilter : isAtStart}
                leftIcon={<ChevronLeftIcon />}
                onClick={
                  switcher ? handleClickPrev : fetchPreviousPageOfPlayers
                }
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

export default TeamList;
