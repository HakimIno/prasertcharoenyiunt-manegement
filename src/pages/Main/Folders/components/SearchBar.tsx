import React from 'react';
import { Box, Button, Flex, TextField } from '@radix-ui/themes';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const SearchBar: React.FC = () => {
    return (
        <Flex className={"flex flex-row gap-2 max-w-sm"}>
            <Box width={"100%"}>
                <TextField.Root placeholder="Search the docs…" radius='large'>
                    <TextField.Slot>
                        <MagnifyingGlassIcon height="16" width="16" />
                    </TextField.Slot>
                </TextField.Root>
            </Box>
            <Button radius="large">
                <MagnifyingGlassIcon height="16" width="16" />
            </Button>
        </Flex>
    );
};

export default SearchBar;
