import { atom } from "recoil";
import { buildListModel, IListModel } from "./_defaultListModel";

interface IExam{
    id: number;
    name: string;
    type: string;
    dateStart: string;
    maxMember: number;
    rules: string;
}

// const model = buildListModel<IListModel, IExam>("examsAtom");
// export const examsAtom = model.atom;
// export const examsDataSelector = model.dataSelector;

export const examsAtom = buildListModel<IExam>("examsAtom");