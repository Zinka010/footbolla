import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  Box,
  Center,
  Heading,
  Stack,
  StackDivider,
  Text,
  Link
} from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import { Card, CardBody } from "@chakra-ui/card";
import { Player } from "../types/types";
import { API_URL } from "../util/CONSTANTS";
import { Spinner } from "@chakra-ui/react";

const RosterPage = () => {
  const { teamId } = useParams();

  return (
    <>
      <Navbar />
      <Center minHeight="100vh" minWidth="100%" bg="gray.200">
        <TeamRoster team_id={Number(teamId)} />
      </Center>
    </>
  );
};

interface TeamProfileProps {
  team_id: number;
}

const TeamRoster: React.FC<TeamProfileProps> = ({ team_id }) => {
  const [roster, setRoster] = useState<Player[] | null>(null);

  useEffect(() => {
    const getTeam = async () => {
      const data = await fetch(`${API_URL}/roster/${team_id}`);
      const res = await data.json();
      if (res.length) setRoster(res);
    };

    getTeam();
  }, [team_id]);

  // here we fetch the team roster from the backend
  return (
    <Box minWidth="300px" bg="white" rounded="2xl" m={20} p={16}>
      <Heading size="3xl" mb={10}>
        Team Roster
      </Heading>
      <Card>
        {roster ? (
          <>
            <CardBody>
              <Stack divider={<StackDivider />} spacing={4}>

              {roster.map((player) => {
                return (
                  <Box>
                    <Link 
                      style={{textDecorationLine: 'underline'}} 
                      href={`/player/${player.player_id}`}>
                        {player?.name}
                      </Link>
                    <Text pt="2" fontSize="sm">{player?.season}</Text>
                  </Box>
                )
              })}

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

export default RosterPage;
