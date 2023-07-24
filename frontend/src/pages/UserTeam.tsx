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
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { PlayerPositions, positionMap } from "../util/CONSTANTS";
import { useUserTeam } from "../hooks/useUserTeam";
import { useNameSearch } from "../hooks/useNameSearch";
import { debounce } from "lodash";
import { setTeamIcon } from "../util/API.ts";

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
  const navigate = useNavigate();

  const teamId = params["teamId"];
  const teamName = searchParams.get("teamName");

  const { team, save, addPlayer, changeLocalTeamIcon } = useUserTeam(
    Number(teamId)
  );

  const toast = useToast();

  const { isOpen, onClose, onOpen } = useDisclosure();

  const icons = [
    "Icon1.png",
    "Icon2.png",
    "Icon3.png",
    "Icon4.png",
    "Icon5.png",
    "Icon6.png",
    "Icon7.png",
    "Icon8.png",
    "Icon9.png",
    "Icon10.png",
    "Icon11.png",
    "Icon12.png",
    "Icon13.png",
    "Icon14.png",
    "Icon15.png",
    "Icon16.png",
    "Icon17.png",
    "Icon18.png",
    "Icon19.png",
    "Icon20.png",
    "Icon21.png",
    "Icon22.png",
    "Icon23.png",
    "Icon24.png",
    "Icon25.png",
  ];
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

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
            <Heading
              mb={6}
              size="3xl"
              textAlign="left"
              style={{ display: "flex" }}
            >
              <img src={`/${team?.icon}`} width="60" height="30" />
            </Heading>

            <Button p={6} fontSize={24} onClick={onOpen}>
              Change Icon
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Choose An Icon</ModalHeader>
                <ModalCloseButton></ModalCloseButton>
                <ModalBody>
                  {icons.map((item) => (
                    <Button
                      key={item}
                      mr={2}
                      mt={2}
                      variant={item == selectedIcon ? "solid" : "outline"}
                      onClick={() => setSelectedIcon(item)}
                    >
                      <img src={`/${item}`} width="30" height="30" />
                    </Button>
                  ))}
                </ModalBody>
                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={async () => {
                      if (selectedIcon != null) {
                        const response = await setTeamIcon(
                          teamId,
                          selectedIcon
                        );

                        if (response) {
                          toast({
                            colorScheme: "green",
                            title: "Icon changed sucessfully",
                            position: "top",
                            isClosable: true,
                          });
                          changeLocalTeamIcon(selectedIcon);
                        } else {
                          toast({
                            colorScheme: "red",
                            title: "Could not change Icon",
                            position: "top",
                            isClosable: true,
                          });
                        }
                      }

                      onClose();
                    }}
                  >
                    Choose
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={() => {
                      onClose();
                      setSelectedIcon(null);
                    }}
                  >
                    Cancel
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

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
                  navigate("/myTeams");
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
          <Heading
            mb={6}
            size="3xl"
            textAlign="left"
            style={{ display: "flex" }}
          >
            {teamName}
          </Heading>
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
