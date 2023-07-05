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

const UserTeamList: React.FC = () => {
  const { user } = useContext(UserContext);
  const [teamList, setTeamList] = useState<
    | {
        teamId: number;
        teamName: string;
      }[]
    | null
  >(null);
  const [teamName, setTeamName] = useState<string>("");
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();

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
          <HStack justifyContent="space-between">
            <Heading size="3xl" textAlign={"left"} mb={5}>
              My Teams
            </Heading>
            <Button leftIcon={<PlusSquareIcon />} onClick={onOpen}>
              Add New Team
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Create a new team</ModalHeader>
                <ModalCloseButton></ModalCloseButton>
                <ModalBody>
                  <FormControl>
                    <FormLabel>Team Name</FormLabel>
                    <Input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                    ></Input>
                  </FormControl>
                </ModalBody>
                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={async () => {
                      if (user) {
                        const response = await createNewTeam(
                          teamName,
                          user?.id
                        );

                        if (response) {
                          toast({
                            colorScheme: "green",
                            title: "Team created sucessfully",
                            position: "top",
                          });
                          getTeams();
                        } else {
                          toast({
                            colorScheme: "red",
                            title: "Could not create team",
                            position: "top",
                          });
                        }
                      }

                      onClose();
                    }}
                  >
                    Create
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
          </HStack>

          <Divider colorScheme="black" />
          {teamList ? (
            teamList.map((item) => (
              <>
                <Box width="full" p={8} textAlign={"left"}>
                  <Link
                    href={`/myTeams/${item.teamId}?teamName=${item.teamName}`}
                    fontSize={20}
                  >
                    {item.teamName}
                  </Link>
                </Box>
                <Divider />
              </>
            ))
          ) : (
            <Spinner size="lg" m={40} />
          )}
        </Box>
      </Center>
    </>
  );
};

export default UserTeamList;
