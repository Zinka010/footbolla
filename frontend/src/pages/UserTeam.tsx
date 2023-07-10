import {
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
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
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { ExtendedPlayer, UserTeam } from "../types/types";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { useParams, useSearchParams } from "react-router-dom";
import { PlayerPositions, positionMap } from "../util/CONSTANTS";
import { useUserTeam } from "../hooks/useUserTeam";
import { useNameSearch } from "../hooks/useNameSearch";
import { debounce } from "lodash";

interface PlayerCardProps {
  position: PlayerPositions;
  addPlayer: (position: PlayerPositions, player: ExtendedPlayer) => boolean;
  team: UserTeam | null;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  position,
  addPlayer,
  team,
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<ExtendedPlayer | null>(
    null
  );
  const { results: playerResults, search: playerSearch } = useNameSearch();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const playerPosition = team
    ? team.positions.find((item) => item.position == position)
    : null;
  const player =
    playerPosition && team
      ? team.players.find((item) => item.player_id == playerPosition.player_id)
      : null;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    debouncedSearch(e.target.value);

  const debouncedSearch = debounce(
    (target: string) => playerSearch(target),
    300
  );

  const handleSelectPlayer = () => {
    if (selectedPlayer) {
      addPlayer(position, selectedPlayer);
      setSelectedPlayer(null);
      onClose();
    }
  };

  return (
    <GridItem>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Select a player for the <b>{positionMap[position]}</b> position
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Search by player name</FormLabel>
              <Input type="text" onChange={handleSearch} />
            </FormControl>
            {playerResults.map((player) => {
              return (
                <Button
                  key={player.player_id}
                  mr={2}
                  mt={2}
                  variant={
                    selectedPlayer?.player_id == player.player_id
                      ? "solid"
                      : "outline"
                  }
                  onClick={() => setSelectedPlayer(player)}
                >
                  {player.name}
                </Button>
              );
            })}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSelectPlayer}>
              Confirm
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                setSelectedPlayer(null);
                onClose();
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Center>
        <Box bg="gray.400" rounded="2xl" p={15} w="200px">
          {player ? (
            <VStack>
              <Heading size="md">{player.name}</Heading>
              <Text>DOB: {new Date(player.birthday).toDateString()}</Text>
              <Button variant="solid" onClick={onOpen}>
                Change Player
              </Button>
            </VStack>
          ) : (
            <Button w="full" h="150px" onClick={onOpen}>
              <PlusSquareIcon />
            </Button>
          )}
          <Text fontSize={20}>{positionMap[position]}</Text>
        </Box>
      </Center>
    </GridItem>
  );
};

const UserTeam: React.FC = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();

  const teamId = params["teamId"];
  const teamName = searchParams.get("teamName");

  const { team, save, addPlayer } = useUserTeam(Number(teamId));

  const toast = useToast();

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
        >
          <HStack justifyContent="space-between">
            <Heading mb={6} size="3xl" textAlign="left">
              {teamName}
            </Heading>
            <Button
              p={6}
              fontSize={24}
              onClick={async () => {
                if (await save()) {
                  toast({
                    colorScheme: "green",
                    title: `${teamName} has been successfully saved.`,
                    position: "top",
                    isClosable: true,
                  });
                } else {
                  toast({
                    colorScheme: "red",
                    title: `There was an error in saving ${teamName}`,
                    position: "top",
                    isClosable: true,
                  });
                }
              }}
            >
              Save
            </Button>
          </HStack>
          <Divider />
          <Grid templateColumns="repeat(3, 1fr)" my={5}>
            <PlayerCard
              team={team}
              position={PlayerPositions.LEFT_FORWARD}
              addPlayer={addPlayer}
            />
            <PlayerCard
              team={team}
              position={PlayerPositions.CENTER_FORWARD}
              addPlayer={addPlayer}
            />
            <PlayerCard
              team={team}
              position={PlayerPositions.RIGHT_FORWARD}
              addPlayer={addPlayer}
            />
          </Grid>
          <Grid templateColumns="repeat(3, 1fr)" my={5}>
            <PlayerCard
              team={team}
              position={PlayerPositions.LEFT_MIDFIELDER}
              addPlayer={addPlayer}
            />
            <PlayerCard
              team={team}
              position={PlayerPositions.CENTER_MIDFIELDER}
              addPlayer={addPlayer}
            />
            <PlayerCard
              team={team}
              position={PlayerPositions.RIGHT_MIDFIELDER}
              addPlayer={addPlayer}
            />
          </Grid>
          <Grid templateColumns="repeat(4, 1fr)" my={5}>
            <PlayerCard
              team={team}
              position={PlayerPositions.LEFT_BACK}
              addPlayer={addPlayer}
            />
            <PlayerCard
              team={team}
              position={PlayerPositions.LEFT_CENTER_BACK}
              addPlayer={addPlayer}
            />
            <PlayerCard
              team={team}
              position={PlayerPositions.RIGHT_CENTER_BACK}
              addPlayer={addPlayer}
            />
            <PlayerCard
              team={team}
              position={PlayerPositions.RIGHT_BACK}
              addPlayer={addPlayer}
            />
          </Grid>
          <Grid templateColumns="repeat(1, 1fr)" justifyContent="center" my={5}>
            <Center>
              <PlayerCard
                team={team}
                position={PlayerPositions.GOALKEEPER}
                addPlayer={addPlayer}
              />
            </Center>
          </Grid>
        </Box>
      </Center>
    </>
  );
};

export default UserTeam;
