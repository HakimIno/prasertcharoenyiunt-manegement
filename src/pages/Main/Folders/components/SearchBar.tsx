import React from 'react';
import { Box, Flex, IconButton, TextField } from '@radix-ui/themes';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const SearchBar: React.FC = () => {
    return (
        <Flex className={"flex flex-row gap-2 max-w-sm"}>
            <Box width={"100%"}>
                <TextField.Root placeholder="ค้นหาชื่อไฟล์" radius='large'>
                    <TextField.Slot>
                        <MagnifyingGlassIcon height="16" width="16" />
                    </TextField.Slot>
                </TextField.Root>
            </Box>
            <IconButton>
                <MagnifyingGlassIcon width="18" height="18" />
            </IconButton>
        </Flex>
    );
};

export default SearchBar;
