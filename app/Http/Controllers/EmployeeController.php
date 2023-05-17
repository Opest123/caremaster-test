<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use App\Http\Resources\EmployeeResource;
use App\Http\Requests\StoreEmployeesRequest;
use App\Http\Requests\UpdateEmployeesRequest;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $per_page = $request->per_page ? $request->per_page : 10;
        $search = $request->search;

        return EmployeeResource::collection(Employee::with('company')
            ->when($search, function ($query) use ($search) {
                $query->where('first_name', 'LIKE', '%' . $search . '%')
                    ->orWhere('last_name', 'LIKE', '%' . $search . '%')
                    ->orWhere('email', 'LIKE', '%' . $search . '%')
                    ->orWhere('phone', 'LIKE', '%' . $search . '%');
            })->orderBy('created_at', 'DESC')->paginate($per_page));
    }

    public function store(StoreEmployeesRequest $request)
    {
        $employee = Employee::create([
            'company_id' => $request->company_id,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone' => $request->phone,
        ]);

        return response()->json($employee, 200);
    }

    public function update(UpdateEmployeesRequest $request, Employee $employee)
    {
        $employee->company_id = $request->company_id;
        $employee->first_name = $request->first_name;
        $employee->last_name = $request->last_name;
        $employee->email = $request->email;
        $employee->phone = $request->phone;

        $employee->save();

        return response()->json($employee, 200);
    }

    public function destroy(Employee $employee)
    {
        $employee->delete();

        return response()->json(null, 204);
    }
}
