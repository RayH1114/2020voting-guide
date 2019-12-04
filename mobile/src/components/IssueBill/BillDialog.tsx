import { Box, Button, DialogContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { simplifyCaseOfAction } from '../../utils';
import ChangedBill from '../Bill/ChangedBill';
import { CircleIcon } from '../PartyIcon';
import Dialog from '../Dialog';

const defaultInfo = {
    bill: {
        name: '',
        billNo: '',
        pdfUrl: '',
        docUrl: '',
        billOrg: '',
        billProposer: [],
        billCosignatory: [],
        caseOfAction: '',
        proposerType: '',
        vernacular: ''
    },
    descriptions: []
};

const useStyle = makeStyles({
    bottomPanel: {
        boxSizing: 'border-box',
        backgroundColor: 'rgba(255, 255, 255, 0.8)'
    }
});

const BillDialog = ({
    id,
    open,
    handleClose
}: {
    id: string;
    open: boolean;
    handleClose: () => void;
}) => {
    const classes = useStyle();
    const [info, setInfo] = React.useState(defaultInfo);
    React.useEffect(() => {
        fetch(`/api/bill/${id}`)
            .then(res => res.json())
            .then(setInfo);
    }, [id]);

    const bill = info.bill;
    const descriptions = info.descriptions;

    const personalPropose = (
        <>
            <Typography variant="h4">提案</Typography>
            <Box display="flex" flexDirection="row" flexWrap="wrap" py={1}>
                {bill.billProposer.map(({ name, party }) => (
                    <Box flexShrink={0} pr={2.5} key={name}>
                        <Typography
                            variant="h4"
                            color="textSecondary"
                            display="inline"
                        >
                            {name}
                        </Typography>
                        <CircleIcon party={party} />
                    </Box>
                ))}
            </Box>
            <Typography variant="h4">連署</Typography>
            <Box display="flex" flexDirection="row" flexWrap="wrap" py={1}>
                {bill.billCosignatory.map(({ name, party }) => (
                    <Box flexShrink={0} pr={2.5} key={name}>
                        <Typography
                            variant="h4"
                            color="textSecondary"
                            display="inline"
                        >
                            {name}
                        </Typography>
                        <CircleIcon party={party} />
                    </Box>
                ))}
            </Box>
        </>
    );

    const cosignatoryPropose = (
        <>
            <Typography variant="h4">提案黨團：</Typography>
            <Box py={1} pr={1}>
                {bill.billOrg}
            </Box>
        </>
    );

    const modifyBill = (
        <>
            {descriptions.map((description, i) => (
                <ChangedBill key={i} index={i + 1} {...description} />
            ))}
            <Box my={2}>
                <Typography variant="h3">修正說明</Typography>
            </Box>
            {descriptions.map((description: { description: string }, i) => (
                <Typography variant="h4">
                    {i + 1}. {description.description}
                </Typography>
            ))}
        </>
    );
    const newBill = (
        <>
            <Typography variant="h4" color="textSecondary" gutterBottom>
                你發現了一個新條文，所以沒有修正條文對照，請直接看原文 PDF
                的完整法條！
            </Typography>
            <Box my={2}>
                <Button
                    href={bill.pdfUrl || bill.docUrl}
                    variant="contained"
                    color="primary"
                    target="_blank"
                >
                    原文PDF
                </Button>
            </Box>
        </>
    );

    return !open ? null : (
        <Dialog
            top={
                <Typography variant="h3" gutterBottom>
                    {bill.name}
                </Typography>
            }
        >
            <DialogContent>
                <Typography variant="h5" color="textSecondary" gutterBottom>
                    {bill.vernacular}
                </Typography>
                <Box my={2}>
                    <Typography variant="h4" color="textSecondary" gutterBottom>
                        {bill.billNo
                            ? bill.billNo.substring(0, 3) +
                              '/' +
                              bill.billNo.substring(3, 5) +
                              '/' +
                              bill.billNo.substring(5, 7) +
                              ' ' +
                              '提案'
                            : ''}
                    </Typography>
                </Box>

                <Box my={2}>
                    <Typography variant="h3">案由</Typography>
                </Box>
                <Box my={2}>
                    <Typography variant="h4" color="textSecondary">
                        {simplifyCaseOfAction(bill.caseOfAction)}
                    </Typography>
                </Box>

                <Box my={2}>
                    <Typography variant="h3">提案 / 連署人</Typography>
                </Box>
                {bill.proposerType === '立委提案'
                    ? personalPropose
                    : cosignatoryPropose}

                <Box my={2}>
                    <Typography variant="h3">修正條文</Typography>
                </Box>
                {descriptions.length ? modifyBill : newBill}
            </DialogContent>
            <Box
                position="absolute"
                display="flex"
                justifyContent="flex-end"
                bottom="0"
                padding="16px 16px "
                height="72px"
                width="100%"
                className={classes.bottomPanel}
            >
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleClose}
                >
                    關閉
                </Button>
            </Box>
        </Dialog>
    );
};

export default BillDialog;
