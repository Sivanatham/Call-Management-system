import React, { useState, useEffect } from 'react';
import { Upload, Users, FileSpreadsheet } from 'lucide-react';

const ExcelUpload = ({ onSubmit }) => {
  const token = localStorage.getItem("token");
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({
    teamId: '',
    file: null
  });

  const fetchTeams = async () => {
  try {
    const res = await fetch("http://localhost:8000/teams/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      setTeams(data);
    }

  } catch (err) {
    console.log("Team fetch failed:", err);
  }
};

  useEffect(() => {
    fetchTeams();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'file' ? files[0] : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      teamId: '',
      file: null
    });
  };

  return (
    <div className="glass-effect rounded-xl p-6 card-hover border border-gray-200 " style={{ marginTop: "70px" }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-500 text-white rounded-lg">
          <FileSpreadsheet size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">
          Assign Task to Team
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label className="form-label">
            Select Team
          </label>
          <select
            name="teamId"
            value={formData.teamId}
            onChange={handleChange}
            required
            className="form-input"
          >
            <option value="">-- Select Team --</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            Upload Excel File
          </label>
          <div className="relative">
            <input
              type="file"
              name="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleChange}
              required
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className={`file-upload-area cursor-pointer ${
                formData.file ? 'has-file' : ''
              }`}
            >
              <Upload size={24} className={formData.file ? 'text-green-600' : 'text-gray-400'} />
              <div className="file-upload-content">
                <p className={`file-upload-title ${formData.file ? 'text-green-600' : 'text-gray-600'}`}>
                  {formData.file ? formData.file.name : 'Choose Excel file or drag and drop'}
                </p>
                <p className="file-upload-subtitle">
                  .xlsx, .xls, .csv files only
                </p>
              </div>
            </label>
          </div>
        </div>

        <button type="submit" className="btn-warning w-full">
          <Upload size={20} className="inline mr-2" />
          Assign Task
        </button>
      </form>
    </div>
  );
};

export default ExcelUpload;