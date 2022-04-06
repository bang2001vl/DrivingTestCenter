import { examsAtom } from "../model/exam";
import buildListAction from "./_defaultListActions";

export const useExamActions = buildListAction(examsAtom, "exam");