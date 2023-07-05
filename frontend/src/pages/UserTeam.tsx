import {
  Box,
  Button,
  Center,
  Divider,
  Grid,
  GridItem,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
// import { useState } from "react";
// import { ExtendedPlayer } from "../types/types";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { useParams, useSearchParams } from "react-router-dom";

interface PlayerCardProps {
  position: string;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ position }) => {
  /*
  const [selectedPlayer, setSelectedPlayer] = useState<ExtendedPlayer | null>(
    null
  );
  
  const [player, setPlayer] = useState<ExtendedPlayer | null>(null);
  */
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <GridItem>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Select a player for the <b>{position}</b> position
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Insert search bar here where user can search for and select player.
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                // setPlayer(selectedPlayer);
                onClose();
              }}
            >
              Confirm
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                // setPlayer(null);
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
          <Button w="full" h="150px" onClick={onOpen}>
            <PlusSquareIcon />
          </Button>
          <Text fontSize={20}>{position}</Text>
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

  console.log(teamId);

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
          <Heading mb={6} size="3xl" textAlign="left">
            {teamName}
          </Heading>
          <Divider />
          <Grid templateColumns="repeat(3, 1fr)" my={5}>
            <PlayerCard position="Attacker" />
            <PlayerCard position="Attacker" />
            <PlayerCard position="Attacker" />
          </Grid>
          <Grid templateColumns="repeat(3, 1fr)" my={5}>
            <PlayerCard position="Midfielder" />
            <PlayerCard position="Midfielder" />
            <PlayerCard position="Midfielder" />
          </Grid>
          <Grid templateColumns="repeat(4, 1fr)" my={5}>
            <PlayerCard position="Defender" />
            <PlayerCard position="Defender" />
            <PlayerCard position="Defender" />
            <PlayerCard position="Defender" />
          </Grid>
          <Grid templateColumns="repeat(1, 1fr)" justifyContent="center" my={5}>
            <Center>
              <PlayerCard position="Goalkeeper" />
            </Center>
          </Grid>
        </Box>
      </Center>
    </>
  );
};

export default UserTeam;
