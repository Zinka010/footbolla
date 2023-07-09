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
import { TeamExtendedInfo } from "../types/types";
import { API_URL } from "../util/CONSTANTS";
import { Spinner } from "@chakra-ui/react";

const TeamPage = () => {
  const { teamId } = useParams();

  return (
    <>
      <Navbar />
      <Center minHeight="100vh" minWidth="100%" bg="gray.200">
        <TeamProfile team_id={Number(teamId)} />
      </Center>
    </>
  );
};

interface TeamProfileProps {
  team_id: number;
}

const TeamProfile: React.FC<TeamProfileProps> = ({ team_id }) => {
  const [team, setTeam] = useState<TeamExtendedInfo | null>(null);

  useEffect(() => {
    const getTeam = async () => {
      const data = await fetch(`${API_URL}/team/${team_id}`);
      const res = await data.json();
      if (res.length) setTeam(res[0]);
    };

    getTeam();
  }, [team_id]);

//   const [team]

  // here we fetch the player profile from the backend
  return (
    <Box minWidth="300px" bg="white" rounded="2xl" m={20} p={16}>
      <Heading size="3xl" mb={10}>
        Team Info
      </Heading>
      <Card>
        {team ? (
          <>
            <CardHeader fontSize={30} fontWeight={700}>
            {team?.team_long_name}
            </CardHeader>
            <CardBody>
              <Stack divider={<StackDivider />} spacing={4}>
                {team?.buildUpPlaySpeedClass ? (
                    <Box>
                    <Heading size="xs" textTransform="uppercase">
                        Speed Class
                    </Heading>
                    <Text pt="2" fontSize="sm">
                    {team?.buildUpPlaySpeedClass}
                    </Text>
                    </Box>
                ): null}
                {team?.buildUpPlayDribblingClass ? (
                    <Box>
                    <Heading size="xs" textTransform="uppercase">
                        Dribbling Class
                    </Heading>
                    <Text pt="2" fontSize="sm">
                        {team?.buildUpPlayDribblingClass}
                    </Text>
                    </Box>
                ) : null }
                {team?.chanceCreationPassingClass ? (
                    <Box>
                    <Heading size="xs" textTransform="uppercase">
                        Passing Class
                    </Heading>
                    <Text pt="2" fontSize="sm">
                    {team?.chanceCreationPassingClass}
                    </Text>
                    </Box>
                ): null }
                {team?.chanceCreationCrossingClass ? (
                    <Box>
                    <Heading size="xs" textTransform="uppercase">
                        Crossing Class
                    </Heading>
                    <Text pt="2" fontSize="sm">
                    {team?.chanceCreationCrossingClass}
                    </Text>
                    </Box>
                ): null }
                {team?.chanceCreationShootingClass ? (
                    <Box>
                    <Heading size="xs" textTransform="uppercase">
                        Shooting Class
                    </Heading>
                    <Text pt="2" fontSize="sm">
                    {team?.chanceCreationShootingClass}
                    </Text>
                    </Box>
                ): null}
                {team?.chanceCreationPositioningClass ? (
                    <Box>
                    <Heading size="xs" textTransform="uppercase">
                        Positioning Class
                    </Heading>
                    <Text pt="2" fontSize="sm">
                    {team?.chanceCreationPositioningClass}
                    </Text>
                    </Box>
                ): null}
                {team?.defenceTeamWidthClass ? (
                    <Box>
                    <Heading size="xs" textTransform="uppercase">
                        Team Width Class
                    </Heading>
                    <Text pt="2" fontSize="sm">
                    {team?.defenceTeamWidthClass}
                    </Text>
                    </Box>
                ): null }
                {team?.defenceAgressionClass ? (
                    <Box>
                    <Heading size="xs" textTransform="uppercase">
                        Agression Class
                    </Heading>
                    <Text pt="2" fontSize="sm">
                    {team?.defenceAgressionClass}
                    </Text>
                    </Box>
                ): null}
                {team?.defenceDefenderLineClass ? (
                    <Box>
                    <Heading size="xs" textTransform="uppercase">
                        Defender Line Class
                    </Heading>
                    <Text pt="2" fontSize="sm">
                    {team?.defenceDefenderLineClass}
                    </Text>
                    </Box>
                ): null }
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

export default TeamPage;
