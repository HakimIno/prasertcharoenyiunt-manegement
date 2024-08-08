// GLOBAL - imports from npm
// STYLES
import { FoldersContainer } from './Folders.styles';
import { Box, Button, Flex, Tabs } from '@radix-ui/themes';
import { useState, useEffect } from 'preact/hooks';
import SearchBar from './components/SearchBar';
import FolderTable, { columns } from './components/FolderTable';
import supabase from '../../../utils/supabase';
import { File } from '../../../types';
import { PlusIcon } from '@heroicons/react/24/solid';
import DialogInput from '../../../components/Dialog';
import { useFetchIcons } from '../../../hooks/useFetchIcons';

export default function Folders() {

    const dataIcon = useFetchIcons();
    const [filesWithIcons, setFilesWithIcons] = useState<File[]>([]);

    useEffect(() => {
        const fetchFilesWithIcons = async () => {
            const { data, error } = await supabase
                .from('files')
                .select(`
                    id,
                    filename,
                    opened,
                    owner,
                    icon:icon (
                        icon_url
                    )
                `);

            if (error) {
                console.error('Error fetching files with icons:', error);
                return [];
            }

            setFilesWithIcons(data);
        };

        fetchFilesWithIcons();
    }, []);


    return (
        <FoldersContainer className="w-full h-full flex justify-center bg-slate-50">
            <div className="max-w-screen-2xl w-full flex flex-col bg-white my-10 p-10 rounded-xl">
                <Flex direction="column" gap="5">
                    <h5 className="text-xl font-bold">จัดการไฟล์</h5>
                    <Flex direction="column" gap="3">
                        <Flex justify={"between"} width={"100%"}>
                            <SearchBar />

                            <DialogInput
                                trigger={
                                    <Button radius="large" variant="surface" >
                                        <PlusIcon className={"w-4 h-4"} />
                                        เพิ่มไฟล์
                                    </Button>
                                }
                                title='เพิ่มไฟล์'
                                dataIcon={dataIcon}
                            />
                        </Flex>

                        <Box>
                            <Tabs.Root defaultValue="all">
                                <Tabs.List>
                                    <Tabs.Trigger value="all">ทั้งหมด</Tabs.Trigger>
                                    {dataIcon.map((item) => (
                                        <Tabs.Trigger value={item?.type} className={"gap-2"}>
                                            <img src={item?.icon_url} alt={item?.type} style={{ width: '20px', height: '20px' }} />
                                            {item?.type?.toUpperCase()}
                                        </Tabs.Trigger>
                                    ))}
                                </Tabs.List>

                                <Box pt="3">
                                    <Tabs.Content value="all">
                                        <FolderTable columns={columns} data={filesWithIcons} />
                                    </Tabs.Content>

                                    <Tabs.Content value="pdf">
                                        <FolderTable columns={columns} data={filesWithIcons.filter((folder: { filename: string; }) => folder.filename.endsWith('.pdf'))} />
                                    </Tabs.Content>

                                    <Tabs.Content value="xls">
                                        <FolderTable columns={columns} data={filesWithIcons.filter((folder: { filename: string; }) => folder.filename.endsWith('.xls'))} />
                                    </Tabs.Content>

                                    <Tabs.Content value="jpg">
                                        <FolderTable columns={columns} data={filesWithIcons.filter((folder: { filename: string; }) => folder.filename.endsWith('.jpg'))} />
                                    </Tabs.Content>
                                </Box>
                            </Tabs.Root>
                        </Box>
                    </Flex>
                </Flex>
            </div>
        </FoldersContainer>
    );
}

Folders.propTypes = {};

Folders.defaultProps = {};
