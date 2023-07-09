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
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/userContext";
import { API_URL } from "../util/CONSTANTS";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { createNewTeam } from "../util/API";
import { predictWinner } from "../util/API";

const UserTeamList: React.FC = () => {
  const { user } = useContext(UserContext);
  const [teamList, setTeamList] = useState<
    | {
        teamId: number;
        teamName: string;
      }[]
    | null
  >(null);
  const [inputTeamName1, setInputTeamName1] = useState<string>("");
  const [inputTeamName2, setInputTeamName2] = useState<string>("");
  const [teamName1, setTeamName1] = useState<string>("None");
  const [teamName2, setTeamName2] = useState<string>("None");
  const [winner, setWinner] = useState<string>("");
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { isOpen: isOpen2, onClose: onClose2, onOpen: onOpen2 } = useDisclosure();
  const toast = useToast();

  const setTeam1 = () => {
      setTeamName1("New");
    };
  const setTeam2 = () => {
        setTeamName2("New");
      };

  const setWinner1 = () => {
          const a = predictWinner(teamName1, teamName2);
          setWinner(a);
      };

  const getTeams = useCallback(async () => {
    if (user) {
      const url = `${API_URL}/getUserTeams/${user.id}`;
      const data = await fetch(url);
      const res = await data.json();

      if (res && res.length) {
        setTeamList(res);
      } else {
        setTeamList([]);
      }
    }
  }, [user]);

  useEffect(() => {
    getTeams();
  }, [user, getTeams]);

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
                  <FormControl>
                    <Input
                      type="text"
                      value={inputTeamName1}
                      onChange={(e) => setInputTeamName1(e.target.value)}
                    ></Input>
                  </FormControl>
                </ModalBody>
                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={async () => {
                      if (user) {
                        setTeamName1(inputTeamName1);
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
                  <FormControl>
                    <Input
                      type="text"
                      value={inputTeamName2}
                      onChange={(e) => setInputTeamName2(e.target.value)}
                    ></Input>
                  </FormControl>
                </ModalBody>
                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={async () => {
                      if (user) {
                        setTeamName2(inputTeamName2);
                      }

                      onClose2();
                    }}
                  >
                    Choose
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={() => {
                      onClose2();
                    }}
                  >
                    Cancel
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>



          <HStack justifyContent="space-between">
            <Heading size="3xl" textAlign={"left"} mb={5}>
              Compare My Teams
            </Heading>
          </HStack>

          <Button leftIcon={<PlusSquareIcon />} onClick={onOpen}>
              Choose Team 1
            </Button>
            <Button leftIcon={<PlusSquareIcon />} onClick={onOpen2}>
              Choose Team 2
            </Button>
          <HStack justifyContent="space-between">
          <Heading size="2xl" textAlign={"left"} mb={5}>
                        Your team 1 is: {teamName1}
                      </Heading>
          </HStack>
          <HStack justifyContent="space-between">
          <Heading size="2xl" textAlign={"left"} mb={5}>
                        Your team 2 is: {teamName2}
                      </Heading>
          </HStack>
          <Button onClick={setWinner1}>
              Predict the Winner
            </Button>
          <HStack justifyContent="space-between">
          <Heading size="2xl" textAlign={"left"} mb={5}>
                        The winner is: {winner}
                      </Heading>
          </HStack>

        </Box>
      </Center>
    </>
  );
};

export default UserTeamList;
