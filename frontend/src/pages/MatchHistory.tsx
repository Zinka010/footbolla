import {
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/userContext";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { useFilterSearch } from "../hooks/useFilterSearch";
import { Match, OverallMatchHistory, TeamExtendedInfo } from "../types/types";
import { debounce } from "lodash";
import { fetchLastFiveMatches, fetchOverallMatchHistory } from "../util/API";

interface Team {
  teamId: number;
  teamName: string;
  icon: string;
}

const MatchHistory: React.FC = () => {
  const [teamOne, setTeamOne] = useState<TeamExtendedInfo | null>(null);
  const [teamTwo, setTeamTwo] = useState<TeamExtendedInfo | null>(null);
  const [overallMatchHistory, setOverallMatchHistory] =
    useState<OverallMatchHistory | null>(null);
  const [lastFiveMatches, setLastFiveMatches] = useState<Match[] | null>(null);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isOpen2,
    onClose: onClose2,
    onOpen: onOpen2,
  } = useDisclosure();

  const emptyList: TeamExtendedInfo[] = [];

  const closeAndReset = () => {
    resetSearchResults();
    onClose();
  };

  const close2AndReset = () => {
    resetSearchResults();
    onClose2();
  };

  useEffect(() => {
    getOverallMatchHistory();
    getLastFiveMatches();
  }, [teamOne]);

  useEffect(() => {
    getOverallMatchHistory();
    getLastFiveMatches();
  }, [teamTwo]);

  const getOverallMatchHistory = async () => {
    if (teamOne && teamTwo) {
      const res = await fetchOverallMatchHistory(
        teamOne.team_id,
        teamTwo.team_id
      );
      setOverallMatchHistory(res);
    }
  };

  const getLastFiveMatches = async () => {
    if (teamOne && teamTwo) {
      const res = await fetchLastFiveMatches(teamOne.team_id, teamTwo.team_id);
      setLastFiveMatches(res);
    }
  };

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

  const {
    teamResults: teamResults,
    filterSearch: playerFilterSearch,
    resetSearchResults,
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
        >
          <Modal isOpen={isOpen} onClose={closeAndReset}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Select Team 1</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl>
                  <FormLabel>Search by team name</FormLabel>
                  <Input type="text" onChange={handleFilterSearch} />
                </FormControl>
                {(switcher ? teamResults : emptyList)
                  ?.filter((item) =>
                    teamTwo ? teamTwo.team_id != item.team_id : true
                  )
                  .slice(0, 10)
                  .map((team) => {
                    return (
                      <Button
                        key={team.team_id}
                        mr={2}
                        mt={2}
                        variant={
                          teamOne?.team_id == teamOne?.team_id
                            ? "solid"
                            : "outline"
                        }
                        onClick={() => {
                          setTeamOne(team);
                        }}
                      >
                        {team.team_long_name}
                      </Button>
                    );
                  })}
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={() => closeAndReset()}
                >
                  Confirm
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    closeAndReset();
                    setTeamOne(null);
                  }}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Modal isOpen={isOpen2} onClose={close2AndReset}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Select Team 2</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl>
                  <FormLabel>Search by team name</FormLabel>
                  <Input type="text" onChange={handleFilterSearch} />
                </FormControl>
                {(switcher ? teamResults : emptyList)
                  .filter((item) =>
                    teamOne ? teamOne.team_id != item.team_id : true
                  )
                  .slice(0, 10)
                  .map((team) => {
                    return (
                      <Button
                        key={team.team_id}
                        mr={2}
                        mt={2}
                        variant={
                          teamOne?.team_id == teamOne?.team_id
                            ? "solid"
                            : "outline"
                        }
                        onClick={() => {
                          setTeamTwo(team);
                        }}
                      >
                        {team.team_long_name}
                      </Button>
                    );
                  })}
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={() => close2AndReset()}
                >
                  Confirm
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    close2AndReset();
                    setTeamTwo(null);
                  }}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Heading size="3xl" textAlign={"center"} mb={5}>
            Match History
          </Heading>
          <Divider />
          <Center mt={4}>
            <HStack gap={10}>
              <Button p={10} leftIcon={<PlusSquareIcon />} onClick={onOpen}>
                {teamOne ? teamOne.team_short_name : "Choose team 1"}
              </Button>
              <Button p={10} leftIcon={<PlusSquareIcon />} onClick={onOpen2}>
                {teamTwo ? teamTwo.team_short_name : "Choose team 2"}
              </Button>
            </HStack>
          </Center>
          <Heading size="1xl" textAlign={"left"} mb={5} paddingTop={10}>
            Aggregate Match History
          </Heading>
          <TableContainer width="100%">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>
                    {teamOne?.team_long_name
                      ? teamOne?.team_long_name + " wins"
                      : "Team 1 Wins"}
                  </Th>
                  <Th>
                    {teamTwo?.team_long_name
                      ? teamTwo?.team_long_name + " wins"
                      : "Team 2 Wins"}
                  </Th>
                  <Th>Ties</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>{overallMatchHistory?.numTeam1Win}</Td>
                  <Td>{overallMatchHistory?.numTeam2Win}</Td>
                  <Td>{overallMatchHistory?.numTeam2Win}</Td>
                </Tr>
              </Tbody>
              <Heading size="1xl" textAlign={"left"} mb={5} paddingTop={10}>
                Last 5 Matches
              </Heading>
              <Thead>
                <Tr>
                  <Th>Match Season</Th>
                  <Th>
                    {teamOne?.team_long_name
                      ? teamOne?.team_long_name + " Score"
                      : "Team 1 Score"}
                  </Th>
                  <Th>
                    {teamTwo?.team_long_name
                      ? teamTwo?.team_long_name + " Score"
                      : "Team 2 Score"}
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {lastFiveMatches?.map((match) => {
                  return (
                    <Tr key={match.season}>
                      <Td>{match.season}</Td>
                      <Td>{match.team1_score}</Td>
                      <Td>{match.team2_score}</Td>
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

export default MatchHistory;
