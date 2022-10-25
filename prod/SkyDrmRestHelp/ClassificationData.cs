using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkyDrmRestHelp
{
    public class ClassifyLabel
    {
        public string name;
        public bool bDefault;
    }

    public class ClassifyCategory
    {
        public string name;
        public bool multiSel;
        public bool mandatory;
        public List<ClassifyLabel> labels;
    }

    public class ClassificationData
    {
        public int maxCategoryNum;
        public int maxLabelNum;
        public List<ClassifyCategory> categories;
    }

    public class ClassificationResult
    {
        public int statusCode;
        public string message;
        public ClassificationData data;
    }
}
