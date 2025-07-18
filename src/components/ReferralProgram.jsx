import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  SimpleGrid,
  Badge,
  Divider,
  useClipboard,
  List,
  ListItem
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUserPlus, FiGift, FiLink, FiCopy, FiMail, FiShare2 } = FiIcons;

const MotionBox = motion(Box);

const ReferralProgram = () => {
  const [referralLink] = useState('https://toucanwin.com/ref/john123');
  const [email, setEmail] = useState('');
  const { hasCopied, onCopy } = useClipboard(referralLink);
  const toast = useToast();

  const referralStats = {
    pending: 3,
    completed: 5,
    totalEarned: 2500
  };

  const rewardTiers = [
    { count: 1, points: 500, description: 'First successful referral' },
    { count: 5, points: 1000, description: 'Reach 5 referrals' },
    { count: 10, points: 2500, description: 'Achieve 10 referrals' }
  ];

  const handleEmailInvite = () => {
    if (!email) {
      toast({
        title: 'Please enter an email address',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    toast({
      title: 'Invitation Sent!',
      description: `Invitation has been sent to ${email}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    setEmail('');
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Join ToucanWin Rewards',
        text: 'Join me on ToucanWin Rewards and get bonus points!',
        url: referralLink
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box bgGradient="linear(to-r, purple.600, purple.400)" color="white" py={10}>
        <Container maxW="container.xl">
          <VStack spacing={6} align="center" textAlign="center">
            <SafeIcon icon={FiUserPlus} className="text-5xl" />
            <Heading as="h1" size="xl">
              Refer Friends, Earn Rewards
            </Heading>
            <Text fontSize="lg" maxW="600px">
              Invite your friends to join ToucanWin Rewards and earn bonus points for every successful referral!
            </Text>
          </VStack>
        </Container>
      </Box>

      <Container maxW="container.xl" py={12}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          {/* Left Column - Referral Actions */}
          <VStack spacing={6} align="stretch">
            {/* Referral Link Section */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              bg="white"
              p={6}
              borderRadius="xl"
              shadow="md"
            >
              <VStack spacing={4} align="stretch">
                <HStack>
                  <SafeIcon icon={FiLink} className="text-purple-500" />
                  <Heading size="md">Your Referral Link</Heading>
                </HStack>
                <InputGroup size="lg">
                  <Input
                    value={referralLink}
                    isReadOnly
                    pr="4.5rem"
                    bg="gray.50"
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={onCopy}>
                      <SafeIcon icon={FiCopy} />
                      {hasCopied ? ' Copied!' : ''}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </VStack>
            </MotionBox>

            {/* Email Invite Section */}
            <Box bg="white" p={6} borderRadius="xl" shadow="md">
              <VStack spacing={4} align="stretch">
                <HStack>
                  <SafeIcon icon={FiMail} className="text-purple-500" />
                  <Heading size="md">Invite via Email</Heading>
                </HStack>
                <InputGroup size="lg">
                  <Input
                    placeholder="friend@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleEmailInvite}>
                      Send
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </VStack>
            </Box>

            {/* Share Options */}
            <Box bg="white" p={6} borderRadius="xl" shadow="md">
              <VStack spacing={4} align="stretch">
                <HStack>
                  <SafeIcon icon={FiShare2} className="text-purple-500" />
                  <Heading size="md">Share</Heading>
                </HStack>
                <Button
                  leftIcon={<SafeIcon icon={FiShare2} />}
                  colorScheme="purple"
                  onClick={handleShare}
                  size="lg"
                >
                  Share with Friends
                </Button>
              </VStack>
            </Box>
          </VStack>

          {/* Right Column - Stats and Rewards */}
          <VStack spacing={6} align="stretch">
            {/* Referral Stats */}
            <Box bg="white" p={6} borderRadius="xl" shadow="md">
              <VStack spacing={4} align="stretch">
                <Heading size="md">Your Referral Stats</Heading>
                <SimpleGrid columns={3} gap={4}>
                  <VStack>
                    <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                      {referralStats.pending}
                    </Text>
                    <Text fontSize="sm" color="gray.600">Pending</Text>
                  </VStack>
                  <VStack>
                    <Text fontSize="2xl" fontWeight="bold" color="green.500">
                      {referralStats.completed}
                    </Text>
                    <Text fontSize="sm" color="gray.600">Completed</Text>
                  </VStack>
                  <VStack>
                    <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                      {referralStats.totalEarned}
                    </Text>
                    <Text fontSize="sm" color="gray.600">Points Earned</Text>
                  </VStack>
                </SimpleGrid>
              </VStack>
            </Box>

            {/* Reward Tiers */}
            <Box bg="white" p={6} borderRadius="xl" shadow="md">
              <VStack spacing={4} align="stretch">
                <HStack>
                  <SafeIcon icon={FiGift} className="text-purple-500" />
                  <Heading size="md">Reward Tiers</Heading>
                </HStack>
                <List spacing={3}>
                  {rewardTiers.map((tier, index) => (
                    <ListItem key={index}>
                      <HStack
                        p={4}
                        bg="gray.50"
                        borderRadius="md"
                        justify="space-between"
                      >
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="bold">{tier.description}</Text>
                          <Badge colorScheme="purple">
                            {tier.points} points
                          </Badge>
                        </VStack>
                        <Badge
                          colorScheme={referralStats.completed >= tier.count ? "green" : "gray"}
                        >
                          {referralStats.completed >= tier.count ? "Achieved" : `${tier.count} referrals needed`}
                        </Badge>
                      </HStack>
                    </ListItem>
                  ))}
                </List>
              </VStack>
            </Box>
          </VStack>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default ReferralProgram;