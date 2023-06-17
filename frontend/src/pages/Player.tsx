import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  Box,
  Center,
  Heading,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/layout";
import playersJSON from "../sample_data/players.json";
import { useMemo } from "react";
import { Card, CardBody, CardHeader } from "@chakra-ui/card";

const PlayerPage = () => {
  const { playerId } = useParams();

  console;
  return (
    <>
      <Navbar homePage={false} />
      <Center minHeight="100vh" minWidth="100%" bg="gray.200">
        <PlayerProfile playerId={Number(playerId)} />
      </Center>
    </>
  );
};

interface PlayerProfileProps {
  playerId: number;
}

const PlayerProfile: React.FC<PlayerProfileProps> = ({ playerId }) => {
  const player = useMemo(
    () => playersJSON.find((item) => item.id === playerId),
    [playerId]
  );

  // here we fetch the player profile from the backend
  return (
    <Box minWidth="300px" bg="white" rounded="2xl" m={20} p={16}>
      <Heading size="3xl" mb={10}>
        Player Profile
      </Heading>
      <Card>
        <CardHeader fontSize={30} fontWeight={700}>
          {player?.name}
        </CardHeader>
        <CardBody>
          <Stack divider={<StackDivider />} spacing={4}>
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Date Of Birth
              </Heading>
              <Text pt="2" fontSize="sm">
                {player?.dob}
              </Text>
            </Box>
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Height (cm)
              </Heading>
              <Text pt="2" fontSize="sm">
                {player?.height}
              </Text>
            </Box>
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Weight (kg)
              </Heading>
              <Text pt="2" fontSize="sm">
                {player?.weight}
              </Text>
            </Box>
          </Stack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default PlayerPage;
