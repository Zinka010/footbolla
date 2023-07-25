import {
  Box,
  Button,
  Center,
  Divider,
  HStack,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/userContext";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { predictWinner, getUserTeams } from "../util/API";

interface Team {
  teamId: number;
  teamName: string;
  icon: string;
}

const UserTeamList: React.FC = () => {
  const { user } = useContext(UserContext);
  const [teamList, setTeamList] = useState<Team[] | null>(null);
  const [teamOne, setTeamOne] = useState<Team | null>(null);
  const [teamTwo, setTeamTwo] = useState<Team | null>(null);
  const [winner, setWinner] = useState<Team | null>(null);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isOpen2,
    onClose: onClose2,
    onOpen: onOpen2,
  } = useDisclosure();

  const getWinner = async () => {
    if (teamOne && teamTwo) {
      const winner = await predictWinner(teamOne?.teamId, teamTwo?.teamId);
      const parsedWinner = Number(winner[0]);

      setWinner(teamList?.find((team) => team.teamId == parsedWinner) || null);
    }
  };

  useEffect(() => {
    const getTeams = async () => {
      if (user) {
        const res = await getUserTeams(user.id);
        setTeamList(res);
      }
    };

    getTeams();
  }, [user]);

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
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Choose Team 1</ModalHeader>
              <ModalCloseButton></ModalCloseButton>
              <ModalBody>
                {teamList
                  ?.filter((item) =>
                    teamTwo ? teamTwo.teamId != item.teamId : true
                  )
                  .map((item) => (
                    <Button
                      key={item.teamId}
                      mr={2}
                      mt={2}
                      variant={
                        teamOne?.teamId == item.teamId ? "solid" : "outline"
                      }
                      onClick={() => setTeamOne(item)}
                    >
                      <Image src={item.icon} width="30" height="30" mr={4} />
                      {item.teamName}
                    </Button>
                  ))}
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={() => onClose()}>
                  Choose
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    onClose();
                    setTeamOne(null);
                  }}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Modal isOpen={isOpen2} onClose={onClose2}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Choose Team 2</ModalHeader>
              <ModalCloseButton></ModalCloseButton>
              <ModalBody>
                {teamList
                  ?.filter((item) =>
                    teamOne ? teamOne.teamId != item.teamId : true
                  )
                  .map((item) => (
                    <Button
                      key={item.teamId}
                      mr={2}
                      mt={2}
                      variant={
                        teamTwo?.teamId == item.teamId ? "solid" : "outline"
                      }
                      onClick={() => setTeamTwo(item)}
                    >
                      <Image src={item.icon} width="30" height="30" mr={4} />
                      {item.teamName}
                    </Button>
                  ))}
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={() => onClose2()}>
                  Choose
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    setTeamTwo(null);
                    onClose2();
                  }}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Heading size="3xl" textAlign={"center"} mb={5}>
            Compare My Teams
          </Heading>
          <Divider />
          <Center mt={4}>
            <HStack gap={10}>
              <Button
                p={10}
                leftIcon={teamOne ? undefined : <PlusSquareIcon />}
                onClick={onOpen}
              >
                {teamOne && (
                  <Image src={teamOne?.icon} width="30" height="30" mr={4} />
                )}
                {teamOne ? teamOne.teamName : "Choose team 1"}
              </Button>

              <Button p={10} leftIcon={teamTwo ? undefined : <PlusSquareIcon />} onClick={onOpen2}>
                {teamTwo && (
                  <Image src={teamTwo?.icon} width="30" height="30" mr={4} />
                )}
                {teamTwo ? teamTwo.teamName : "Choose team 2"}
              </Button>
            </HStack>
          </Center>

          <HStack justifyContent="space-between">
            <Heading size="2xl" textAlign={"left"} mb={5}>
              {/* Your team 1 is: {teamName1} */}
            </Heading>
          </HStack>
          <HStack justifyContent="space-between">
            <Heading size="2xl" textAlign={"left"} mb={5}>
              {/* Your team 2 is: {teamName2} */}
            </Heading>
          </HStack>
          <Button isDisabled={!teamOne || !teamTwo} onClick={getWinner}>
            Predict the Winner
          </Button>
          <Heading size="xl" textAlign={"center"} my={5}>
            {winner && `The winner is ${winner.teamName}`}
          </Heading>
        </Box>
      </Center>
    </>
  );
};

export default UserTeamList;
