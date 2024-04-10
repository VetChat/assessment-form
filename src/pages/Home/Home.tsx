import { useEffect, useState } from "react";
import AnimalSelector from "../../components/AnimalSelector/AnimalSelector";
import CheckboxItem from "../../components/CheckboxItem/CheckboxItem.tsx";
import {
  FormAnswer,
  AnswerResponse,
  Step,
  Symptom,
  Ticket,
  WarningRes,
  AnswerRecord,
  UrgentCase,
} from "./Interface/Home.ts";
import axios from "axios";
import { CiWarning } from "react-icons/ci";
import QuestionItem from "../../components/QuestionItem/QuestionItem.tsx";
import { useMutation, useQuery } from "react-query";
import {
  FormValue,
  Question,
  QuestionSet,
} from "../../components/QuestionItem/interface/QuestionItem";
import { CheckboxOption } from "../../components/CheckboxItem/interface/CheckboxItem.ts";
import { LoadingOverlay } from "@mantine/core";
import Swal from "sweetalert2";
import {
  AnswerRecordCreate,
  AnswerRecordResponse,
  AnswerRecordsService,
  QuestionService,
  QuestionSetService,
  TicketQuestionsService,
  TicketsService,
  UrgentCasesService,
} from "../../client/index.ts";

interface WarningType {
  urgencyDetail: string;
  duration: string;
}

const Home = () => {
  const [animalId, setAnimalId] = useState<number>();
  const [stepNumber, setStepNumber] = useState(Step.choosePet);
  const [warning, setWarning] = useState<WarningType | null>(null);
  const [ticketId, setTicketId] = useState<number>();
  const [QA, setQA] = useState<QuestionSet[]>([]);

  const ticket = useMutation({
    mutationFn: (answer: AnswerResponse) =>
      TicketsService.ticketsCreateTicket({ requestBody: answer }).then((res) =>
        setTicketId(res.ticketId)
      ),
  });

  const trackingQuestion = useQuery({
    queryKey: ["trackingQuestion"],
    queryFn: () =>
      TicketQuestionsService.ticketQuestionsGetTicketQuestions().then((res) => {
        const data: Question[] = res.map((item) => ({
          questionId: item.questionId,
          question: item.question,
          pattern: item.pattern,
          ordinal: item.ordinal,
          isRequired: item.isRequired,
          listAnswer: item.listAnswer,
        }));
        return data;
      }),
  });

  const urgentCases = useQuery<UrgentCase[]>({
    queryKey: ["urgentCases", animalId],
    queryFn: () =>
      UrgentCasesService.urgentCasesGetUrgentCasesByAnimalId({
        animalId: animalId!,
      }),
    enabled: !!animalId,
  });

  const symptoms = useQuery<Symptom[]>({
    queryKey: ["symptoms"],
    queryFn: () =>
      fetch(`http://localhost:8000/symptoms/animal/${animalId}`).then((res) =>
        res.json()
      ),
    enabled: !!animalId && stepNumber === Step.chooseSymptom,
  });

  const questionSet = useMutation({
    mutationKey: ["questionSet"],
    mutationFn: (question: { questionSetId: number }[]) =>
      QuestionService.questionGetQuestionsBySetIds({ requestBody: question }),
  });

  const answerRecord = useMutation({
    mutationKey: ["answerRecord"],
    mutationFn: (data: AnswerRecordCreate) =>
      AnswerRecordsService.answerRecordsCreateAnswerRecords({
        requestBody: data,
      }),
  });

  const mapUrgentToOption = (value: UrgentCase[] | undefined) => {
    if (!value) {
      return;
    }
    const option: CheckboxOption[] = value.map((item) => ({
      id: item.urgentId,
      label: item.urgentName,
      checked: false,
    }));
    return option;
  };

  const mapSymptomtoOption = (value: Symptom[] | undefined) => {
    if (!value) {
      return;
    }
    const option: CheckboxOption[] = value.map((item) => ({
      id: item.questionSetId,
      label: item.symptomName,
      checked: false,
    }));
    return option;
  };

  const handleSelectAnimal = (id: number | undefined) => {
    if (id) {
      setAnimalId(id);
      setStepNumber(Step.chooseUrgent);
    }
  };

  const handleSelectUrgent = (selectedOption: CheckboxOption[]) => {
    const selectedId = selectedOption.map((item) => item.id);
    const filtered = urgentCases.data!.filter((item) =>
      selectedId.includes(item.urgentId)
    );

    const resposeBody: WarningRes[] = filtered.map((item) => ({
      urgencyId: item.urgencyId,
      urgentId: item.urgentId,
    }));

    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/urgency/most_urgent",
          resposeBody
        );
        return response.data;
      } catch (error) {}
    };
    if (selectedOption.length > 0) {
      setStepNumber(Step.done);
      const urgencyWarning = fetchData();
      urgencyWarning.then((warn) => setWarning(warn));
    } else if (selectedOption.length === 0) {
      setStepNumber(Step.tracking);
    }
  };

  const handleSelectSymptom = async (selectedOption: CheckboxOption[]) => {
    if (selectedOption.length === 0) {
      alert("Please contact vet");
      return;
    }
    const responseBody = selectedOption.map((item) => ({
      questionSetId: item.id,
    }));
    questionSet
      .mutateAsync(responseBody)
      .then((res: QuestionSet[]) => setQA(res));
    setStepNumber(Step.answerQuestion);
  };

  const handleBack = () => {
    if (stepNumber > Step.choosePet) {
      setStepNumber(stepNumber - 1);
    }
  };

  const mapFormToAnswer = (formValue: FormValue) => {
    const ans: FormAnswer[] = [];
    for (const key in formValue.answerList) {
      ans.push({
        questionId: parseInt(key),
        answer: formValue.answerList[key],
      });
    }
    return ans;
  };

  const handleSubmitHistory = (value: FormValue) => {
    const answerList = mapFormToAnswer(value);
    ticket.mutate({
      animalId: animalId!,
      listAnswer: answerList,
    });
    setStepNumber(Step.chooseSymptom);
  };

  const handleSubmitQuestionSet = (formValue: FormValue) => {
    console.log("questionSetAnswer: ", formValue);
    const answer = [];
    for (let key in formValue.answerList) {
      answer.push({
        questionId: parseInt(key),
        answer: formValue.answerList[key],
      });
    }

    const recordData: AnswerRecordCreate = {
      ticketId: ticketId!,
      listAnswer: answer,
    };

    answerRecord
      .mutateAsync(recordData)
      .then((res: AnswerRecordResponse) => {
        Swal.fire({
          title: "Success",
          text: "Your answer has been recorded",
          icon: "success",
          confirmButtonText: "Cool",
        });
      })
      .then(() => setStepNumber(Step.done));
  };

  if (warning) {
    return (
      <div className="flex flex-col mt-40 justify-center items-center w-full">
        <div className="flex gap-4 pb-10">
          <img
            className="h-20 w-20"
            src="https://upload.wikimedia.org/wikipedia/th/thumb/5/51/Logo_ku_th.svg/1200px-Logo_ku_th.svg.png"
          />
          <img
            className="h-20 w-20"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRhkqA4g_kyg6siSXAzyxhOGw9Amn0ROsGLyPNXBt5Ug&s"
            alt="Kasetsart Veterinary Hosipital"
          />
        </div>
        <label className="text-[25px] text-red-700 font-semibold">
          {warning.urgencyDetail}
        </label>
        <br />
        <label>{warning.duration}</label>
        {/* <ProgressBar active={Step.done} /> */}
      </div>
    );
  }

  return (
    <div className="flex w-full h-full justify-center overflow-auto bg-white">
      {stepNumber === Step.choosePet && (
        <AnimalSelector onSubmit={handleSelectAnimal} />
      )}
      {stepNumber === Step.chooseUrgent && (
        <div>
          {urgentCases.isLoading ? (
            <LoadingOverlay visible>Loading...</LoadingOverlay>
          ) : (
            <CheckboxItem
              title="โปรดเลือกอาการฉุกเฉินที่พบในสัตว์เลี้ยงของคุณ"
              optionList={mapUrgentToOption(urgentCases.data) ?? []}
              onSubmit={handleSelectUrgent}
              onBack={handleBack}
            />
          )}
        </div>
      )}
      {stepNumber === Step.tracking && (
        <QuestionItem
          title="กรอกประวัติสัตว์เลี้ยง"
          onSubmitHandler={handleSubmitHistory}
          questionSet={[{ listQuestion: trackingQuestion?.data! }]}
        />
      )}
      {stepNumber === Step.chooseSymptom && (
        <div>
          <CheckboxItem
            title="โปรดระบุอาการที่พบ"
            optionList={mapSymptomtoOption(symptoms.data) ?? []}
            onSubmit={handleSelectSymptom}
            onBack={handleBack}
          />
        </div>
      )}
      {stepNumber === Step.answerQuestion && QA && (
        <QuestionItem
          title="ระบุอาการสัตว์เลี้ยง"
          isQA={true}
          questionSet={QA}
          onSubmitHandler={handleSubmitQuestionSet}
        />
      )}
      {stepNumber === Step.done && (
        <div className="flex flex-col pt-20 justify-center items-center">
          <CiWarning className="text-red-400 text-9xl"></CiWarning>
          <label className="text-[25px] font-semibold">ไม่พบอาการฉุกเฉิน</label>
          <br />
          <label>กรุณาติดต่อสัตวแพทย์เพื่อรับคำแนะนำ</label>
          {/* <ProgressBar active={Step.done} /> */}
        </div>
      )}
      {/* <ProgressBar active={stepNumber} /> */}
    </div>
  );
};

export default Home;
