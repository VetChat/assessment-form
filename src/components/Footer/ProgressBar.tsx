import { Stepper } from "@mantine/core";
import React from "react";
import { ProgressBarProps } from "./interface/ProgressBar";

const ProgressBar: React.FC<ProgressBarProps> = ({ active }) => {
  return (
    <div className="fixed bottom-0 w-full h-140 border border-slate-200 p-10 bg-slate-100">
      <Stepper
        color="rgba(102, 176, 0, 1)"
        active={active}
        allowNextStepsSelect={false}
        iconSize={50}
      >
        <Stepper.Step
          label="Step 1"
          description="ระบุชนิดสัตว๋เลี้ยง"
        ></Stepper.Step>
        <Stepper.Step label="Step 2" description="อาการฉุกเฉิน"></Stepper.Step>
        <Stepper.Step label="Step 3" description="กรอกประวัติ"></Stepper.Step>
        <Stepper.Step label="Step 4" description="เลือกอาการ"></Stepper.Step>
        <Stepper.Step label="Step 5" description="ตอบคำถาม"></Stepper.Step>
        <Stepper.Step label="Step 6" description="สรุปผล"></Stepper.Step>
      </Stepper>
    </div>
  );
};

export default ProgressBar;
