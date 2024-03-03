import { Stepper } from "@mantine/core";
import React from "react";
import { ProgressBarProps } from "./interface/ProgressBar";

const ProgressBar: React.FC<ProgressBarProps> = ({ active }) => {
  return (
    <div className="fixed bottom-0 w-full border border-slate-200 px-5 py-10">
      <Stepper
        size="xs"
        color="rgba(102, 176, 0, 1)"
        active={active}
        allowNextStepsSelect={false}
        wrap={false}
      >
        <Stepper.Step
          label="Step 1"
          description="ระบุชนิดสัตว๋เลี้ยง"
        ></Stepper.Step>
        <Stepper.Step label="Step 2" description="ประเมินอาการ"></Stepper.Step>
        <Stepper.Step label="Step 3" description="กรอกประวัติ"></Stepper.Step>
        <Stepper.Step label="Step 4" description="สรุปผล"></Stepper.Step>
      </Stepper>
    </div>
  );
};

export default ProgressBar;
