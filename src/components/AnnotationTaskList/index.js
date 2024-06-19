import React, {useState} from 'react';
import {
    Backdrop,
    Button,
    CircularProgress,
    Container,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";

const AnnotationTaskList = (props) => {

    const [isLoading, setIsLoading] = useState(false);

    async function remove(id) {
        await fetch(`https://annotation.ai4h.net/annotationtasks/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            let updatedTasks = [...props.tasks].filter(i => i.id !== id);
            props.tasks = updatedTasks;
        });
    }

    const taskList = props.tasks?.map(task => {
        return <TableRow key={task.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell style={{whiteSpace: 'nowrap'}}>{task.kind}</TableCell>
            <TableCell style={{whiteSpace: 'nowrap'}}>{task.title}</TableCell>
            <TableCell style={{whiteSpace: 'nowrap'}}>{task.description}</TableCell>
            <TableCell>
                <Stack direction={"row"} spacing={2} justifyContent="flex-end">
                    <Button size="small" color={"error"} onClick={() => remove(task.id)}>Delete</Button>
                </Stack>

            </TableCell>
        </TableRow>
    });

    return (
            <div>


                <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <CircularProgress color="inherit" />
                </Backdrop>

                <Container className={'pt-5'}>

                    <h3>Annotation Tasks</h3>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell width={"20%"}>Kind</TableCell>
                                    <TableCell width={"20%"}>Title</TableCell>
                                    <TableCell width={"30%"}>Description</TableCell>
                                    <TableCell width={"30%"} align={"right"}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {taskList}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </Container>
            </div>
        );

}
export default AnnotationTaskList;
