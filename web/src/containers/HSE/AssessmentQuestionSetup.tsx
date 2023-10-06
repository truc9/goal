import { FiDownload, FiPlus, FiPlusSquare, FiXCircle } from "react-icons/fi"
import { PageContainer } from "../../components/PageContainer"
import { Popup } from "../../components/Popup"
import { useMemo, useState } from "react"
import { Box, FormControl, FormControlLabel, FormGroup, FormLabel, IconButton, Radio, RadioGroup, Tab, Tabs, TextareaAutosize, Typography } from "@mui/material"
import { IoSettings } from "react-icons/io5"
import { QuestionModel, QuestionType } from "./models/QuestionModel"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { v4 as uuid_v4 } from 'uuid'

interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
}

function TabContent(props: TabPanelProps) {
    const { children, value, index, ...other } = props
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    )
}

const AssessmentQuestionSetup = () => {
    // main model to submit
    const [question, setQuestion] = useState<QuestionModel>({
        description: '',
        type: QuestionType.FreeText,
        choices: []
    })

    const [openQuestionPopup, setOpenQuestionPopup] = useState(false)
    const [openChoicePopup, setOpenChoicePopup] = useState(false)
    const [currentTab, setCurrentTab] = useState(0)
    const [answerSetupEnable, setAnswerSetupEnable] = useState(false)
    const [customChoice, setCustomChoice] = useState('')
    const choiceColDefs: GridColDef[] = [
        { field: 'description', headerName: 'Description', width: 400 },
        {
            field: 'id',
            headerName: '',
            sortable: false,
            filterable: false,
            renderCell: () => {
                return (
                    <IconButton>
                        <FiXCircle className="tw-text-red-500" />
                    </IconButton>
                )
            }
        }
    ]

    const isChoiceQuestion = useMemo(() => {
        return (+question.type === QuestionType.SingleChoice || +question.type === QuestionType.MultipleChoice)
    }, [question.type])

    const showQuestionPopup = () => {
        setOpenQuestionPopup(true)
    }

    const showAnswerPopup = () => {
        setOpenChoicePopup(true)
    }

    const handleTabChange = (_: any, tabIndex: number) => {
        setCurrentTab(tabIndex)
    }

    const handleQuestionChange = (e: any) => setQuestion({ ...question, description: e.target.value })

    const handleQuestionTypeChange = (_: any, id: string) => {
        const isAnswerEnabled = [
            QuestionType.YesNo,
            QuestionType.YesNoNA,
            QuestionType.SingleChoice,
            QuestionType.MultipleChoice,
            QuestionType.Confirmation
        ].includes(+id)

        setQuestion({ ...question, type: +id })
        setAnswerSetupEnable(isAnswerEnabled)
    }

    const handleCustomChoiceChange = (e: any) => {
        setCustomChoice(e.target.value)
    }

    const handleAddChoiceAnswer = () => {
        setQuestion({
            ...question,
            choices: [
                ...question!.choices!,
                { description: customChoice }
            ]
        })
        setCustomChoice('')
        setOpenChoicePopup(false)
    }

    const handleSubmitQuestion = () => {
        console.log(question)
    }

    return (
        <>
            <PageContainer
                title="Assessment Questions"
                action={(
                    <div className="tw-flex tw-items-center tw-gap-2">
                        <button className="btn-secondary" onClick={showQuestionPopup}><FiPlus /> Create</button>
                        <button className="btn-secondary"><FiDownload /> PDF</button>
                    </div>
                )}
                showGoBack
            >
            </PageContainer>

            <Popup
                icon={<IoSettings />}
                isOpen={openQuestionPopup}
                submitLabel="Save"
                title="Question Details"
                onCloseClicked={() => setOpenQuestionPopup(false)}
                onSubmitClicked={handleSubmitQuestion}
            >
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={currentTab} onChange={handleTabChange} aria-label="Question Answer Setup Tabs">
                        <Tab label="Question Setup" />
                        <Tab disabled={!answerSetupEnable} label="Answer Setup" />
                    </Tabs>
                </Box>
                <TabContent value={currentTab} index={0}>
                    <div className="tw-flex tw-flex-col tw-gap-3">
                        <FormGroup>
                            <FormLabel id="question-label" sx={{ fontWeight: 'bold' }}>Question</FormLabel>
                            <TextareaAutosize
                                aria-labelledby="question-label"
                                value={question.description}
                                required={true}
                                maxRows={10}
                                minRows={8}
                                onChange={handleQuestionChange}
                            />
                        </FormGroup>
                        <FormControl>
                            <FormLabel sx={{ fontWeight: 'bold' }} id="question-type-label">Question Type</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="question-type-label"
                                defaultValue={0}
                                value={question.type}
                                name="radio-buttons-group"
                                onChange={handleQuestionTypeChange}
                            >
                                <FormControlLabel value={0} control={<Radio />} label="Text" />
                                <FormControlLabel value={1} control={<Radio />} label="Yes No" />
                                <FormControlLabel value={2} control={<Radio />} label="Yes No N/A" />
                                <FormControlLabel value={3} control={<Radio />} label="Confirmation" />
                                <FormControlLabel value={4} control={<Radio />} label="Photo" />
                                <FormControlLabel value={5} control={<Radio />} label="Single Choice" />
                                <FormControlLabel value={6} control={<Radio />} label="Multiple Choice" />
                            </RadioGroup>
                        </FormControl>
                    </div>
                </TabContent>
                <TabContent value={currentTab} index={1}>
                    <Box sx={{
                        height: 400,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'start',
                        gap: 1
                    }}>
                        {isChoiceQuestion && (
                            <>
                                <button onClick={showAnswerPopup} className="btn-secondary"><FiPlusSquare /> Add Choice</button>
                                <DataGrid
                                    sx={{ width: '100%' }}
                                    getRowId={() => uuid_v4()}
                                    rows={question.choices!}
                                    columns={choiceColDefs}
                                    initialState={{
                                        pagination: {
                                            paginationModel: {
                                                pageSize: 5,
                                            },
                                        },
                                    }}
                                    pageSizeOptions={[5]}
                                    checkboxSelection
                                    disableRowSelectionOnClick
                                />
                            </>
                        )}
                        {question.type === QuestionType.YesNo && (
                            <div>
                                <div>Yes</div>
                                <div>No</div>
                            </div>
                        )}
                        {question.type === QuestionType.YesNoNA && (
                            <div>
                                <div>Yes</div>
                                <div>No</div>
                                <div>N/A</div>
                            </div>
                        )}
                        {question.type === QuestionType.Confirmation && (
                            <div>
                                <div>Confirm</div>
                                <div>Unconfirmed</div>
                            </div>
                        )}
                    </Box>
                </TabContent>
            </Popup >

            <Popup
                size="xs"
                isOpen={openChoicePopup}
                submitLabel="Add"
                title="Choice Setup"
                onCloseClicked={() => setOpenChoicePopup(false)}
                onSubmitClicked={handleAddChoiceAnswer}
            >
                <FormGroup>
                    <FormLabel>Description</FormLabel>
                    <textarea value={customChoice} rows={5} onChange={handleCustomChoiceChange} />
                </FormGroup>
            </Popup>
        </>
    )
}

export default AssessmentQuestionSetup