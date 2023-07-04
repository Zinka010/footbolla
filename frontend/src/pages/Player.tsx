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
import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@chakra-ui/card";
import { ExtendedPlayer } from "../types/types";
import { API_URL } from "../util/CONSTANTS";
import { Spinner } from "@chakra-ui/react";

const PlayerPage = () => {
  const { playerId } = useParams();

  return (
    <>
      <Navbar />
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
  const [player, setPlayer] = useState<ExtendedPlayer | null>(null);

  useEffect(() => {
    const getPlayer = async () => {
      const data = await fetch(`${API_URL}/player/${playerId}`);
      const res = await data.json();
      if (res.length) setPlayer(res[0]);
    };

    getPlayer();
  }, [playerId]);

  // here we fetch the player profile from the backend
  return (
    <Box minWidth="300px" bg="white" rounded="2xl" m={20} p={16}>
      <Heading size="3xl" mb={10}>
        Player Profile
      </Heading>
      <Card>
        {player ? (
          <>
            <CardHeader fontSize={30} fontWeight={700}>
              {player?.name}
            </CardHeader>
            <CardBody>
              <Stack divider={<StackDivider />} spacing={4}>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Preferred Foot
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    {player?.preferred_foot.toUpperCase()}
                  </Text>
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Sprint Speed
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    {player?.sprint_speed}
                  </Text>
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Date Of Birth
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    {player?.birthday}
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
                    Weight (lbs)
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    {player?.weight}
                  </Text>
                </Box>
              </Stack>
            </CardBody>
          </>
        ) : (
          <Center>
            <Spinner size="lg" />
          </Center>
        )}
      </Card>
    </Box>
  );
};

export default PlayerPage;
